exports.module = (jobsArray, request, arrayPassToFront, loggedUsers) => {
    loggedUsers.forEach(value => {
        if(value._id == request.user) {
            jobsArray.forEach(element => {
                if(element.email == value.email) {
                    arrayPassToFront.push(element)
                }
            });
        }
    })
    return arrayPassToFront
}