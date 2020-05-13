var setupCount = 0;
let datas = [];
let colors = ['#ff0000', '#00bfff', '#ff8000', '#ffff00', '#83e800', '#00ffbf', '#00ffff', '#0040ff', '#8000ff', '#ff00ff', '#ff0000', '#808080'];

const widthOfDay = 40;
const marginOfDay = 2;
let diffDay = 0;
let basePrice = 0;
let startDate;
let endDate;

function clickAdd() {
    if (setupCount < 10) {
        var table = document.getElementById("inputTable");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = `<div style="background-color: ${colors[setupCount]};">Setup ${++setupCount}</div>`;

        cell2.innerHTML = `<input type="text" style="width: 50px;" value="100">`;
        cell3.innerHTML = `<select class="selectType" onchange="changeTest(this);" name="select1">
                            <option value="specific_day">Specific Date</option>
                            <option value="by_days">By Days</option>
                            <option value="by_months">By Months</option>
                            <option value="custom_range">Custom Range</option>
                        </select>`;
        cell4.innerHTML = `<input type="text" style="width: 400px;" value="01-05-2020,02-05-2020">`;

        cell5.innerHTML = ``


        var resultPanel = document.getElementById("resultPanel");
        resultPanel.setAttribute("style", `overflow-x: auto; height: ${setupCount * 60 + 150}px;`)

    }
}

function changeTest(element) {

    var val = $(element).val()

    if (val == 'by_days' || val == 'custom_range') {
        let cell = element.parentElement.parentElement.cells[4]
        cell.innerHTML = `<div>
        <input type="Checkbox" name="Sun" >Sun
        <input type="Checkbox" name="Mon" value="yes">Mon
        <input type="Checkbox" name="Tue" value="yes">Tue
        <input type="Checkbox" name="Wed" value="yes">Wed
        <input type="Checkbox" name="Thu" value="yes">Thu
        <input type="Checkbox" name="Fri" value="yes">Fri
        <input type="Checkbox" name="Sat" value="yes">Sat
        </div>
        `
    } else if (val == 'by_months') {
        let cell = element.parentElement.parentElement.cells[4]
        cell.innerHTML = `<div>
        <input type="Checkbox" name="Jan" value="yes">Jan
        <input type="Checkbox" name="Feb" value="yes">Feb
        <input type="Checkbox" name="Mar" value="yes">Mar
        <input type="Checkbox" name="Apr" value="yes">Apr
        <input type="Checkbox" name="May" value="yes">May
        <input type="Checkbox" name="Jun" value="yes">Jun
        <input type="Checkbox" name="Jul" value="yes">Jul
        <input type="Checkbox" name="Aug" value="yes">Aug
        <input type="Checkbox" name="Sep" value="yes">Sep
        <input type="Checkbox" name="Oct" value="yes">Oct
        <input type="Checkbox" name="Nov" value="yes">Nov
        <input type="Checkbox" name="Dec" value="yes">Dec
        </div>
        `
    } else {
        let cell = element.parentElement.parentElement.cells[4]
        cell.innerHTML = ''
    }

    //hardcode
    if (val == 'by_days') {
        let cell = element.parentElement.parentElement.cells[3]
        cell.innerHTML = `<input type="text" style="width: 400px;" value="05-2020,06-2020">`
    } else if (val == 'custom_range') {
        let cell = element.parentElement.parentElement.cells[3]
        cell.innerHTML = `<input type="text" style="width: 400px;" value="01-05-2020,30-05-2020">`
    } else if (val == 'by_months') {
        let cell = element.parentElement.parentElement.cells[3]
        cell.innerHTML = `<input type="text" style="width: 400px;" value="2020,2020">`
    } else {
        let cell = element.parentElement.parentElement.cells[3]
        cell.innerHTML = `<input type="text" style="width: 400px;" value="01-05-2020,02-05-2020">`
    }
}
function processData() {
    datas = [];

    basePrice = document.getElementById('basePrice').value;
    startDate = document.getElementById('startDate').value;
    endDate = document.getElementById('endDate').value;

    startDate = dayjs(startDate, "DD-MM-YYYY")
    endDate = dayjs(endDate, "DD-MM-YYYY")


    var table = document.getElementById('inputTable');
    for (var r = 0, n = table.rows.length; r < n; r++) {
        let price = table.rows[r].cells[1].firstChild.value;
        let option = table.rows[r].cells[2].firstChild.value;
        let values = table.rows[r].cells[3].firstChild.value.split(',');

        let inputs = table.rows[r].cells[4].firstChild ? table.rows[r].cells[4].firstChild.getElementsByTagName('input') : [];
        let checkeds = [];
        for (let item of inputs) {
            if (item.checked) {
                checkeds.push(item.name)
            }
        }

        //2020-05-01,2020-05-10
        let arrDates = [];
        if (option == 'specific_day') {
            values.forEach(element => {
                arrDates.push(dayjs(element, "DD-MM-YYYY"));
            });
        } else if (option == 'custom_range') {
            let start = dayjs(values[0], "DD-MM-YYYY");
            let end = dayjs(values[values.length - 1], "DD-MM-YYYY");
            while (start <= end) {
                let ddd = start.format('ddd');
                if (checkeds.includes(ddd)) {
                    arrDates.push(start);
                }
                start = start.add(1, 'days');
            }
        } else if (option == 'by_days') {
            let start = dayjs(values[0], 'MM-YYYY');
            let end = dayjs(values[values.length - 1], 'MM-YYYY').endOf('month');

            while (start <= end) {
                let ddd = start.format('ddd');
                if (checkeds.includes(ddd)) {
                    arrDates.push(start);
                }
                start = start.add(1, 'days');
            }
        } else if (option == 'by_months') {
            let start = dayjs(values[0]);
            let end = dayjs(values[values.length - 1]).endOf('year');

            while (start <= end) {
                let ddd = start.format('MMM');
                if (checkeds.includes(ddd)) {
                    arrDates.push(start);
                }
                start = start.add(1, 'days');
            }
        }
        datas.push({
            price: parseFloat(price),
            dates: arrDates
        });

    }
    diffDay = endDate.diff(startDate, 'day') + 1;
}

function getDateApply(dateApply) {
    let n = datas.length;
    for (let i = n - 1; i >= 0; i--) {
        const { price, dates } = datas[i];
        // console.log('xxx', price, dateApply, dates);

        if (dates.map(x => x.format('YYYY-MM-DD')).includes(dateApply.format('YYYY-MM-DD'))) {
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

function displayResult() {

    var result1 = document.getElementById('result1');
    let innerHTML1 = ''
    let numOfSetup = datas.length;

    datas.forEach(function ({ dates }, index) {

        let tempHTML = '';
        dates.forEach(date => {
            let diffStart = date.diff(startDate, 'day');
            let diffEnd = endDate.diff(date, 'day');

            if (diffStart >= 0 && diffEnd >= 0) {
                tempHTML += `<div style="background-color: ${colors[index]}; left:${diffStart * widthOfDay}px;width: ${widthOfDay - marginOfDay}px;height: 40px;position: absolute;font-size:10px">${date.format('ddd DD-MMM-YY')}</div>`
            }
        })
        if (tempHTML.length > 0) {
            innerHTML1 += `<div style="display: flex;position: relative;height: 40px">${tempHTML}</div><hr width="100000px">`
        }
    })
    result1.innerHTML = innerHTML1;

    //result2
    var result2 = document.getElementById('result2');
    let dateApply = startDate.clone()
    let tempHTML = ''
    let totalPrice = 0;
    let totalDay = 0;
    let dict = {};
    let dictCountDays = {
        '-1': 0
    };

    while (dateApply <= endDate) {

        let { color, price, setup } = getDateApply(dateApply);

        if (dict[setup]) {
            dict[setup] += parseFloat(price);
            dictCountDays[setup]++;
        } else {
            dict[setup] = parseFloat(price);
            dictCountDays[setup] = 1;
        }
        totalDay++;
        totalPrice += parseFloat(price);
        let diff = dateApply.diff(startDate, 'day');
        // console.log('diff', diff, color, price, dateApply)
        tempHTML += `<div style="background-color: ${color}; left:${diff * widthOfDay}px;width: ${widthOfDay - marginOfDay}px;height: 40px;position: absolute;font-size:10px">${dateApply.format('ddd DD-MMM-YY')}<br>${price}</div>`

        dateApply = dateApply.add(1, 'days');
    }
    result2.innerHTML = `<div style="display: flex;position: relative;height: 40px">${tempHTML}</div>`;

    //result3
    console.table(dict);
    console.table(dictCountDays);

    var result3 = document.getElementById('result3');
    tempHTML = `From <b>${startDate.format('DD MMM YYYY')}</b> to <b>${endDate.format('DD MMM YYYY')}</b><br>`
    tempHTML += `<b>Base:</b> ${dict['-1'] ? accounting.formatNumber(dict['-1']) : 0} - ${dictCountDays['-1']} day(s)<br>`
    for (let i = 0; i < numOfSetup; i++) {
        tempHTML += `<b>Setup ${i + 1}:</b> ${dict[i] ? accounting.formatNumber(dict[i]) : 0} - ${dictCountDays[i] ? dictCountDays[i] : 0} day(s)<br>`
    }
    tempHTML += `<b>Total:</b> ${accounting.formatNumber(totalPrice)} - ${totalDay} day(s)`
    result3.innerHTML = tempHTML;
}
function clickPreview() {
    processData();
    displayResult();
}

function onPageLoad() {
    document.getElementById('startDate').value = dayjs().startOf('month').format("DD-MM-YYYY");
    document.getElementById('endDate').value = dayjs().format("DD-MM-YYYY");
}