"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form"

import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {
  getQuantityOfPermission,getUniquePermissions,
  groupByPermissions,
  matchingTwoObject
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {permissions} from "@/constant"


export default function RoleForm2() {

  const form = useForm()
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [checkedMethods, setCheckedMethods] = React.useState<string[]>([])

  const memoFormPermission = React.useMemo(() => {
    return form.getValues("permissions");
  }, [form.watch("permissions")]);

  const newPermissions = React.useMemo(() => {
    return groupByPermissions(permissions?.data);
  }, [permissions]);

  const recordInPermission = React.useMemo(() => {
    return getQuantityOfPermission(memoFormPermission)
  },[memoFormPermission]);


  const matching = React.useMemo(() => {
    if(permissions && memoFormPermission){
      const data = matchingTwoObject(recordInPermission, permissions?.countDataOfMethods);
      return data
    }
  },[memoFormPermission]);

  React.useEffect(() => {
    if (memoFormPermission?.length === permissions?.data?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [memoFormPermission]);

  const handleSelectAll = (event: any) => {
    if (event) {
      form.setValue(
          "permissions",
          permissions?.data
      );
      setSelectAll(true);
    } else {
      form.setValue("permissions", []);
      setSelectAll(false);
    }
  };

  const handleSingleChange = (e: any, m: any) => {
    if (e) {
      form.setValue("permissions", [...memoFormPermission, m]);
    } else {
      const filterSingle = memoFormPermission?.filter((i: any) => i?._id !== m?._id);
      form.setValue("permissions", filterSingle);
    }
  };

  const handleChooseMethods = (e: any, m: any) => {
    const inputs = document.querySelectorAll(`button[data-method='${m}']`);
    const data = [] as any[];
    if (e) {
      inputs.forEach((e) => {
        const value = e.getAttribute("data-value") as any;
        data.push(JSON.parse(value))
      });
      const flatmap = memoFormPermission && [...memoFormPermission, ...data].flatMap((i) => i);
      form.setValue("permissions", flatmap);
      setCheckedMethods([...checkedMethods, m]);
    } else {
      inputs.forEach((e) => {
        const value = e.getAttribute("data-value") as any
        data.push(JSON.parse(value))
      });
      const filterMethods = checkedMethods?.filter((i) => i !== m);
      setCheckedMethods(filterMethods);
      const clearPer2 = getUniquePermissions(data, memoFormPermission)
      form.setValue("permissions", clearPer2);
    }
  }


  React.useEffect(() => {
    matching && setCheckedMethods(matching)
  },[matching]);



  const submitHandler = (values:any) => {
    console.log("submitHandler", values)
  }
  return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">


            {permissions && (
                <>
                  <div className="check_all_section flex flex-column items-center space-x-2">
                    <label
                        htmlFor="checkall"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Check All
                    </label>
                    <Checkbox
                        id="checkall"
                        onCheckedChange={handleSelectAll}
                        checked={selectAll}
                    />
                  </div>

                  <FormField
                      control={form.control}
                      name="permissions"
                      render={({field}) =>
                      {
                        return (
                            <FormItem>
                              <Table
                                  className="table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <TableHeader
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                                  <TableRow>
                                    <TableHead></TableHead>
                                    {permissions.namePer?.map((i: any, j: any) => {

                                      return (
                                          <TableHead key={j}>
                                            <div className="check_all_section grid gap-2">
                                              <label
                                                  htmlFor="checkall"
                                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                {i}
                                              </label>
                                              <Checkbox id={i}
                                                        data-method_selector={i}
                                                        onCheckedChange={(e) => handleChooseMethods(e, i)}
                                                        checked={checkedMethods.includes(i) ? true : false}
                                              />
                                            </div>
                                          </TableHead>
                                      )
                                    })}
                                  </TableRow>
                                </TableHeader>

                                <TableBody>
                                  {newPermissions &&
                                      newPermissions?.map((i, j) => {
                                        const name = Object.keys(i) as any;
                                        return (
                                            <TableRow key={`${j}.${name}`}>
                                              <TableCell className="font-bold">
                                                {name}
                                              </TableCell>
                                              {name &&
                                                  i[name]?.map((o: any, jj:any) => {
                                                    return (
                                                        <React.Fragment
                                                            key={`${jj}.${o?._id}.${o?.name}.${j}`}
                                                        >
                                                          {o !== null ? (
                                                              <TableCell
                                                                  key={`${jj}.${o?._id}.${o?.name}`}
                                                              >
                                                                <FormField
                                                                    key={o._id}
                                                                    control={form.control}
                                                                    name="permissions"
                                                                    render={({field}) => {
                                                                      const checked = field.value?.some((permission:any) => permission.id === o?._id);
                                                                      return (
                                                                          <FormItem
                                                                              key={o._id}
                                                                              className="flex flex-row items-start space-x-2 space-y-0 w-28 max-w-28  overflow-ellipsis truncate  "
                                                                          >
                                                                            <FormControl>
                                                                              <Checkbox
                                                                                  data-id={o._id}
                                                                                  data-value={JSON.stringify(o)}
                                                                                  data-method={o.name.split('.')?.at(-1)}
                                                                                  data-name={o.name}
                                                                                  checked={checked}
                                                                                  onCheckedChange={(e) =>
                                                                                      handleSingleChange(e,o)
                                                                                  }

                                                                              />
                                                                            </FormControl>
                                                                          </FormItem>
                                                                      );
                                                                    }}
                                                                />
                                                              </TableCell>
                                                          ) : (
                                                              <>
                                                                <td key={jj}
                                                                    className="p-2">
                                                                  <Checkbox
                                                                      disabled={true}/>
                                                                </td>
                                                              </>
                                                          )}
                                                        </React.Fragment>
                                                    );
                                                  })}
                                            </TableRow>
                                        );
                                      })}
                                </TableBody>
                              </Table>
                            </FormItem>
                        )
                      }



                      }
                  />
                </>
            )}


          </form>
        </Form>
      </>
  );
}
