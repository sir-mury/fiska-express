// permission for who can view order

function canViewOrder (user, order) {
  return user.role === 'admin' || order.user.id == user.id
}

// permission for the orders seen
function scopedOrders (user, orders) {
  if (user.role === 'admin') return orders
  else {
    return orders.filter(order => orders.user.id == user.id)
  }
}

// permission for who can create orders
function canCreateOrders (user) {
  return user.role === 'admin' || user.role === 'basic'
}

// function levelUpdateOrders(user,order){
//     if(user.role === 'driver'){

//     }
// }

// permission for who can delete orders
function canDeleteOrders (user) {
  return user.role === 'admin' || user.role === 'basic'
}

module.exports = {
  canCreateOrders,
  canViewOrder,
  scopedOrders,
  canDeleteOrders
}
