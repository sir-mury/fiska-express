const {User} = require('../models/userModel')

function canControlVehicle(user,vehicle){
    return (
        user.role === 'admin'
    )
}