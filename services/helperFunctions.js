function setDateInterval(duration) {
    const today = new Date();
    if (duration === "weekly") {
        const dayOfWeek = today.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return [startOfWeek, endOfWeek];
    }

    if (duration === "monthly") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        return [startOfMonth, endOfMonth];
    }

    return new Error("Duration entered is wrong!");

}

function jsonExpensesToCsv(data) {
    if (!data.length) return "";

    const headings = Object.keys(data[0]);
    let csvRows = [];
    csvRows.push(headings.join(","));

    for (let ele of data) {
        let values = []
        for (let key of headings) {
            if (key === "createdAt") {
                let formattedDate = formatDate(ele[key]);
                values.push(formattedDate);
            } else {
                values.push(ele[key]);
            }
        }
        csvRows.push(values.join(","));
    }
    return csvRows.join("\n")
}

function formatDate(defaultDate) {
    const date = new Date(defaultDate);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

module.exports = {
    setDateInterval,
    jsonExpensesToCsv,
    formatDate
}