
import fs from "fs";
let c = fs.readFileSync("app/admin/valuation/page.tsx", "utf8");

// Fix initial table header
c = c.replace(/<TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-right">\s*ส่วนต่างรวม \(เผื่อเก็บงาน\)\s*<\/TableHead>\s*<\/TableRow>/, `<TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-right">
                            ส่วนต่างรวม (เผื่อเก็บงาน)
                          </TableHead>
                          <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-center">
                            จัดการ
                          </TableHead>
                        </TableRow>`);

// Fix initial table body cells
c = c.replace(/฿\{\(\(row\.retail_target \|\| 0\) - \(row\.max_buy_in \|\| 0\)\)\.toLocaleString\(\)\}\s*<\/TableCell>\s*<\/TableRow>/g, `฿{((row.retail_target || 0) - (row.max_buy_in || 0)).toLocaleString()}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-6 py-3 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(row)}
                                  className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 h-8 w-8 p-0 mr-1"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(row.id)}
                                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>`);

c = c.replace(/colSpan=\{4\}\s*className="h-48 text-center/g, `colSpan={5}
                              className="h-48 text-center`);

fs.writeFileSync("app/admin/valuation/page.tsx", c);
console.log("Replaced");

