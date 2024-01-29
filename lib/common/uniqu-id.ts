

function uniqueId() {
    return Math.random().toString(36).slice(2, 12);
}

export {
    uniqueId as uniqueId
}
