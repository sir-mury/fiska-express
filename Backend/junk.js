// //check if driver order already exists
// const driverOrderExist = await DriverOrder.findOne({
//     driver: `${req.user.id}`
//   }).populate({
//     path: 'orders',
//     populate: { path: 'user' }
//   })
//   if (driverOrderExist !== null && driverOrderExist.status !== 'completed') {
//     let checkorder = driverOrderExist.orders
//     let orderId = []
//     checkorder.forEach(e => {
//       orderId.push(e.id)
//     })
//     if (!orderId.includes(matchedOrder.id)) {
//       driverOrderExist.orders = [...driverOrderExist.orders, matchedOrder]
//     }
//     await driverOrderExist.save()
//     res.status(201).json({
//       message: `Driver order has successfully been updated and the assigned driver is ${req.user.id}`,
//       driverOrder: driverOrderExist
//     })
//   } else {
//     //create the driver order from the order and the matched driver
//     const driverOrder = await DriverOrder.create({
//       driver: req.user.id,
//       orders: [matchedOrder]
//     })
//     res.status(201).json({
//       message: `Driver order has successfully been created and the assigned driver is ${req.user.id}`,
//       driverOrder: driverOrder
//     })
//     //console.log('matchedDriver:', matchedDriver)
//   }
// })