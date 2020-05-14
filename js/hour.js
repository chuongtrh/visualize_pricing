var setupCount = 0;
let datas = [];
let colors = ['#ff0000', '#00bfff', '#ff8000', '#ffff00', '#83e800', '#00ffbf', '#00ffff', '#0040ff', '#8000ff', '#ff00ff', '#ff0000', '#808080'];

const widthOfDay = 40;
const marginOfDay = 2;

let diffHour = 0;
let basePrice = 0;
let startDate;
let endDate;
let startTimeSlot;
let endTimeSlot;

function clickAdd() {
    if (setupCount < 10) {
        var table = document.getElementById("inputTable");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = `<div style="background-color: ${colors[setupCount]};">Setup ${++setupCount}</div>`;

        cell2.innerHTML = `<input type="text" style="width: 50px;" value="100">`;
        cell3.innerHTML = `<input type="text" style="width: 400px;" value="6,7">`;

        cell4.innerHTML = `<div>
        <input type="Checkbox" name="Sun" >Sun
        <input type="Checkbox" name="Mon" value="yes">Mon
        <input type="Checkbox" name="Tue" value="yes">Tue
        <input type="Checkbox" name="Wed" value="yes">Wed
        <input type="Checkbox" name="Thu" value="yes">Thu
        <input type="Checkbox" name="Fri" value="yes">Fri
        <input type="Checkbox" name="Sat" value="yes">Sat
        </div>
        `

        var resultPanel = document.getElementById("resultPanel");
        resultPanel.setAttribute("style", `overflow-x: auto; height: ${setupCount * 60 + 150}px;`)
    }
}

function processData() {
    datas = [];

    basePrice = document.getElementById('basePrice').value;
    var timeSlots = document.getElementById('timeRange').value.split(',')
    startDate = document.getElementById('startDate').value;
    endDate = document.getElementById('endDate').value;

    startTimeSlot = timeSlots[0];
    endTimeSlot = timeSlots[1];

    startDate = dayjs(startDate, "DD-MM-YYYY")
    endDate = dayjs(endDate, "DD-MM-YYYY")


    // console.log('basePrice', basePrice);
    console.log('startDate', startDate);
    console.log('endDate', endDate);

    startDate = startDate.set('hour', startTimeSlot);
    endDate = endDate.set('hour', endTimeSlot);

    console.log('startDate', startDate);
    console.log('endDate', endDate);


    var table = document.getElementById('inputTable');
    for (var r = 0, n = table.rows.length; r < n; r++) {
        let price = table.rows[r].cells[1].firstChild.value;
        let values = table.rows[r].cells[2].firstChild.value.split(',');

        let inputs = table.rows[r].cells[3].firstChild ? table.rows[r].cells[3].firstChild.getElementsByTagName('input') : [];
        let checkeds = [];
        for (let item of inputs) {
            if (item.checked) {
                checkeds.push(item.name)
            }
        }
        console.log('checkeds', checkeds);
        console.log('values', values);

        //2020-05-01,2020-05-10
        let arrTimeSlots = [];

        let start = parseInt(values[0]);
        let end = parseInt(values[values.length - 1]);
        console.log('start', start);
        console.log('end', end);

        while (start < end) {
            arrTimeSlots.push(start)
            start++;
        }

        datas.push({
            price: parseFloat(price),
            timeSlots: arrTimeSlots,
            checkeds
        });

    }
    diffHour = endDate.diff(startDate, 'hour');

    console.log(diffHour)
    console.log(datas)
}

function getHourApply(dateApply) {
    let n = datas.length;
    let hour = dateApply.hour();
    let ddd = dateApply.format('ddd');
    if (hour >= startTimeSlot && hour < endTimeSlot) {
        for (let i = n - 1; i >= 0; i--) {
            const { price, timeSlots, checkeds } = datas[i];
            // console.log('timeSlots', timeSlots, checkeds, hour)
            if (timeSlots.includes(hour) && checkeds.includes(ddd)) {
                return {
                    setup: i,
                    color: colors[i],
                    price: price
                };
            }
        }
        return {
            setup: -1,
            color: colors[colors.length - 1],
            price: basePrice
        };
    }
    return {
        setup: -2,
        color: colors[colors.length - 1],
        price: basePrice
    };
}

function displayResult() {
    var result1 = document.getElementById('result1');
    var result2 = document.getElementById('result2');
    var result3 = document.getElementById('result3');

    let numOfSetup = datas.length;

    let totalPrice = 0;
    let totalHour = 0;
    let dict = {};
    let dictCountHour = {
        '-1': 0
    };


    let dateApply = startDate.clone()
    let innerHTML2 = ''
    let arrHTML = Array(numOfSetup).fill('');

    while (dateApply < endDate) {

        let { setup, color, price } = getHourApply(dateApply);

        if (setup == -2) {
            dateApply = dateApply.add(1, 'hours');
            continue;
        }

        if (dict[setup]) {
            dict[setup] += parseFloat(price);
            dictCountHour[setup]++;
        } else {
            dict[setup] = parseFloat(price);
            dictCountHour[setup] = 1;
        }
        totalHour++;
        totalPrice += parseFloat(price);

        let diff = dateApply.diff(startDate, 'hour');
        // console.log('diff', diff, color, price, dateApply)

        //Display timeline
        innerHTML2 += `<div style="background-color: ${color}; left:${diff * widthOfDay}px;width: ${widthOfDay - marginOfDay}px;height: 40px;position: absolute;font-size:10px">${dateApply.format('HH:mm ddd DD-MMM-YY')}<br>${price}</div>`

        //Display all setup
        for (let i = numOfSetup - 1; i >= 0; i--) {
            const { price, timeSlots, checkeds } = datas[i];
            let hour = dateApply.hour();
            let ddd = dateApply.format('ddd');

            //console.log('xxx', hour, ddd, timeSlots, checkeds);
            if (timeSlots.includes(hour) && checkeds.includes(ddd)) {
                console.log(`Setup ${i}`, hour, ddd)
                arrHTML[i] += `<div style="background-color: ${colors[i]}; left:${diff * widthOfDay}px;width: ${widthOfDay - marginOfDay}px;height: 40px;position: absolute;font-size:10px">${dateApply.format('HH:mm ddd DD-MMM-YY')}</div>`
            }
        }

        dateApply = dateApply.add(1, 'hours');
    }

    arrHTML = arrHTML.map(x => `<div style="display: flex;position: relative;height: 40px">${x}</div><hr width="100000px">`)
    result1.innerHTML = arrHTML.join('');

    result2.innerHTML = `<div style="display: flex;position: relative;height: 40px">${innerHTML2}</div>`;


    //result3
    console.table(dict);
    console.table(dictCountHour);


    let tempHTML = `From <b>${startDate.format('HH:mm ddd DD-MMM-YYYY')}</b> to <b>${endDate.format('HH:mm ddd DD-MMM-YYYY')}</b><br>`
    tempHTML += `<b>Base:</b> ${dict['-1'] ? accounting.formatNumber(dict['-1']) : 0} - ${dictCountHour['-1']} hour(s)<br>`
    for (let i = 0; i < numOfSetup; i++) {
        tempHTML += `<b>Setup ${i + 1}:</b> ${dict[i] ? accounting.formatNumber(dict[i]) : 0} - ${dictCountHour[i] ? dictCountHour[i] : 0} hour(s)<br>`
    }
    tempHTML += `<b>Total:</b> ${accounting.formatNumber(totalPrice)} - ${totalHour} hour(s)`
    result3.innerHTML = tempHTML;
}
function clickPreview() {
    processData();
    displayResult();
}

function onPageLoad() {
    document.getElementById('startDate').value = dayjs().format("DD-MM-YYYY");
    document.getElementById('endDate').value = dayjs().format("DD-MM-YYYY");
}