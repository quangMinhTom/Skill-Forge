export const SuceessRespond = (res,status,message,data) => {
    return res.status(200).json({
        status,
        message,
        data
    })
}

export const FailedRespond = (res,status,message) => {
    return res.status(500).json({
        status,
        message
    })
}