const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

function findText(searchTerm) {
  knexInstance
    .select('name')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(res => {
      console.log(res);
    });

}

function viewPage(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(res => {
      console.log(res);
    });
}

function viewItemsByDate(daysAgo) {
  knexInstance
    .from('shopping_list')
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw("now()-'?? days'::INTERVAL", daysAgo)
    )
    .then(res=>{
      console.log(res)
    })
}

function getCost() {
  knexInstance
    .select(
      knexInstance.raw("SUM(price), category")
    )
    .from('shopping_list')
    .groupBy('category')
    .orderBy([
      {column: 'sum', order: 'DESC'},
    ])
    .then(res=>{
      console.log(res)
    })
}

getCost()