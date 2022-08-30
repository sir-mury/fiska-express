// permission for driver orders

function canAcceptDriverOrder(user,driverOrder){
    return user.role === 'admin' || driverOrder.driver.id == user.id
}


function canCreateDriverOrder(user){
    return user.role === 'admin' || user.role === 'basic'
}

function otherDriverOrderStuff(user){
    return user.role === 'admin' || user.role === 'driver'
}

module.exports = {
    canAcceptDriverOrder,
    canCreateDriverOrder,
    otherDriverOrderStuff,
}