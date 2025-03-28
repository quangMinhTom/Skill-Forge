//Note that return result is within res body, not header
export const SuccessRespond = (res,status,message,data) => {
    return res.status(200).json({
        status,
        message,
        data
    })
}

export const FailedRespond = (res,statusCode,status,message) => {
    return res.status(statusCode).json({
        status,
        message
    })
}

export const BooleanRespond = (res,status,data) => {
    return res.status(200).json({
        status,
        "exist": !!data
    })
}

