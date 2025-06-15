async function getdata() {
    let name = "Cody";
    try {
        const response = await fetch('./data/tableConvert.com_a9nkxz.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let personalData = getAttendanceByName(data, name);
        let groupedData = groupDataByFields(personalData);
        return groupedData;
    } catch (error) {
        console.error("Error loading data:", error);
        return null;
    }
}
function getAttendanceByName(data, name) {
    return data.filter(record => record["`name`"] === name).map(record => ({
        date: record["`class_date`"],
        class_hours: parseFloat(record["`class_hours`"]),
        raw_hours: parseFloat(record["`raw_hours`"]),
        attendedHours: parseFloat(record["`attended_hours`"]),
        lateHours: parseFloat(record["`late_hours`"]),
        leaveEarlyHours: parseFloat(record["`leave_early_hours`"]),
        absentHours: parseFloat(record["`absent_hours`"])
    }));
}

function groupDataByFields(personalData) {
    return personalData.reduce((grouped, record) => {
        // 初始化陣列
        if (!grouped.dates) {
            grouped.dates = [];
            grouped.classHours = [];
            grouped.rawHours = [];
            grouped.attendedHours = [];
            grouped.lateHours = [];
            grouped.leaveEarlyHours = [];
            grouped.absentHours = [];
        }

        // 將資料推入對應的陣列
        grouped.dates.push(record.date);
        grouped.classHours.push(record.class_hours);
        grouped.rawHours.push(record.raw_hours);
        grouped.attendedHours.push(record.attendedHours);
        grouped.lateHours.push(record.lateHours);
        grouped.leaveEarlyHours.push(record.leaveEarlyHours);
        grouped.absentHours.push(record.absentHours);

        return grouped;
    }, {});
}

function tltalHours(fulldata) {
    console.log(fulldata);
    // 計算總時數
    const totalClassHours = fulldata.classHours.reduce((sum, hours) => sum + hours, 0);
    const totalAttendedHours = fulldata.attendedHours.reduce((sum, hours) => sum + hours, 0);
    const totalAbsentHours = fulldata.absentHours.reduce((sum, hours) => sum + hours, 0);
    const totalLateHours = fulldata.lateHours.reduce((sum, hours) => sum + hours, 0);
    const totalLeaveEarlyHours = fulldata.leaveEarlyHours.reduce((sum, hours) => sum + hours, 0);

    // 更新 HTML 內容
    updateStatsDisplay(totalClassHours, totalAttendedHours, totalAbsentHours, totalLateHours, totalLeaveEarlyHours);

    // 建立圓餅圖
    createPieChart(totalAttendedHours, totalAbsentHours);
}

function updateStatsDisplay(classHours, attendedHours, absentHours, lateHours, leaveEarlyHours) {
    // 更新第一個卡片的內容
    const cardBody = document.querySelector('.total-hours');
    cardBody.innerHTML = `
        <div class="row">
            <div class="col-6">
                <h6 class="card-title">總課程時數</h6>
                <p class="card-text fs-4 text-primary">${classHours.toFixed(1)} 小時</p>
            </div>
            <div class="col-6">
                <h6 class="card-title">實際上課時數</h6>
                <p class="card-text fs-4 text-success">${attendedHours.toFixed(1)} 小時</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-6">
                <h6 class="card-title">缺席時數</h6>
                <p class="card-text fs-5 text-danger">${absentHours.toFixed(1)} 小時</p>
            </div>
            <div class="col-6">
                <h6 class="card-title">遲到時數</h6>
                <p class="card-text fs-5 text-warning">${lateHours.toFixed(1)} 小時</p>
            </div>
        </div>
            <div class="row mt-3">
                <div class="col-6">
                    <h6 class="card-title">早退時數</h6>
                    <p class="card-text fs-5 text-info">${leaveEarlyHours.toFixed(1)} 小時</p>
                </div>
                <div class="col-6">
                    <h6 class="card-title">出勤比率</h6>
                    <p class="card-text fs-4 text-success">${((attendedHours / classHours) * 100).toFixed(1)}%</p>
            </div>
        </div>
    `;
}

function createPieChart(attendedHours, absentHours) {
    const ctx = document.getElementById('attendanceChart');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['出席', '缺席'],
            datasets: [{
                data: [attendedHours, absentHours],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.8)',  // 綠色 - 出席
                    'rgba(220, 53, 69, 0.8)'   // 紅色 - 缺席
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '出席狀況圓餅圖',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}