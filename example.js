/* eslint-disable prettier/prettier */
const memson = require('./index.js')('localhost:8686');

console.log('Welcome to memson client!');

async function evalCmd(cmd) {
  const result = await memson.eval(cmd);
  console.log(JSON.stringify(result, null, 1));
  console.log(result);
}

async function query(cmd) {
  cmd = { query: cmd };
  const result = await memson.eval(cmd);
  console.log(JSON.stringify(cmd, null, 1));
  console.log(result);
}

const main = async () => {
  try {
    console.log('inserting data');
    
    /*
    await memson.set('orders', [
      { customer: 'james', qty: 2, price: 9.0, discount: 10 },
      { customer: 'ania', qty: 2, price: 2.0 },
      { customer: 'misha', qty: 4, price: 1.0 },
      { customer: 'james', qty: 10, price: 16.0, discount: 20 },
      { customer: 'james', qty: 1, price: 16.0 },
    ]
    );
    await memson.set('x', 1);
    await memson.set('y', 2);
    await memson.set('james', { name: 'james perry', age: 30 });
    */
    const examples = [
      {add: [1, 2]},
      {add: ["bob", 2]},
      {add: [3, "bob"]},
      {add: [[1,2,3,4,5], 1]}
    ];
    examples.forEach(async cmd => {
      await evalCmd(cmd);
    });
    console.log('Summary:');
    console.log(await memson.summary());

    const cmds = [

      { key: 'orders' },
      { key: 'x' },
      { key: 'y' },
      { key: 'james' },
      { get: ['price', { key: 'orders' }]},
      { key: 'orders.qty' },
      { mul: [{ key: 'orders.price' }, { key: 'orders.qty' }] },
      { sum: { key: 'orders.qty' } },
      { '+': [{ key: 'orders.customer' }, ' doe'] },
      { unique: { key: 'orders.customer' } },
      { key: 'x' },
      { key: 'y' },
      { key: 'orders' },
      //{ append: ['james', { email: 'james@memson.io' }] },
      { key: 'james' }
    ];
    for (let i = 0; i < cmds.length; i++) {
      await evalCmd(cmds[i]);
    }

    const queries = [
      { from: 'orders' },
      { select: { name: { key: 'customer' } }, from: 'orders' },
      { select: { volume: { sum: { key: 'qty' } } }, from: 'orders' },
      { select: { highestQty: { max: { key: 'qty' } } }, from: 'orders' },
      {
        select: {
          highestQty: { max: { key: 'qty' } },
          lowestQty: { min: { key: 'qty' } },
        },
        from: 'orders'
      },
      {
        select: {
          name: { key: 'customer' },
          orderQty: { key: 'qty' },
        },
        from: 'orders'
      },
      {
        select: {
          orderPrice: {key: 'price'},
          orderQty: {key: 'qty'},
        },
        by: 'customer',
        from: 'orders'
      },
      {
        select: {
          highestPrice: { max: { key: 'price'} },
          lowestQty: { min: { key: 'qty'} },
        },
        by: 'customer',
        from: 'orders'
      }
    ];
    for (let i = 0; i < queries.length; i++) {
      await query(queries[i]);
    }
  }
  catch (e) {
    console.error(e);
  }
};

main();
