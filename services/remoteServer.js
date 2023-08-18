export const searchCustomer = async (db, query) => {
  let str = queryBuilder(query);
  try {
    let customer = await db.query(
      `Select * from dbo.customer as customer where Upper(customer.addr1) like Upper('${str}') OR Upper(customer.addr2) like Upper('%${str}%')`
    );
    for (const element of customer.recordset) {
      const fttx_data = db.query(
        `Select * from dbo.Contact_fttx_data as data where data.d_custid='${element.id}'`
      );
      const dsl_data = db.query(
        `Select * from dbo.Contact_dsl_data as data where data.d_custid='${element.id}'`
      );
      const etherlink_data = db.query(
        `Select * from dbo.Contact_etherlink_data as data where data.d_custid='${element.id}'`
      );
      const wireless_data = db.query(
        `Select * from dbo.Contact_wireless_data as data where data.d_custid='${element.id}'`
      );

      const promise = await Promise.all([
        fttx_data,
        dsl_data,
        etherlink_data,
        wireless_data,
      ]);

      if (promise[0] && promise[0].recordset) {
        element.fttx_data = promise[0].recordset;
      }
      if (promise[1] && promise[1].recordset) {
        element.dsl_data = promise[1].recordset;
      }
      if (promise[2] && promise[2].recordset) {
        element.etherlink_data = promise[2].recordset;
      }
      if (promise[3] && promise[3].recordset) {
        element.wireless_data = promise[3].recordset;
      }
    }
    return customer.recordset;
  } catch (e) {
    console.log(e.message);
  }
};

const queryBuilder = (query) => {
  let str = "";
  query.split(" ").map((element) => {
    str = str + "%" + element;
  });
  str = str + "%";
  return str;
};
