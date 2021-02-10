let unitImageURL = 'https://dshu.innogamescdn.com/asset/5d6f385f/graphic/';

function calculateUnitSpeed(speed) {
    return Math.round(1 / (60 * speed), 2)
}

function distanceBetweenTwoVillage(a, b, arrivalTime, unitSpeeds, type) {
    let firstVillage = a.split('|');
    let secondVillage = b.split('|');
    let distance = Math.sqrt( Math.pow(firstVillage[0] - secondVillage[0], 2) + Math.pow(firstVillage[1] - secondVillage[1], 2));
    let unitSpeedLength = unitSpeeds.length;
    let tmpArr = [];
    while(unitSpeedLength--) {
        let tmp = calculateUnitSpeed(unitSpeeds[unitSpeedLength].speed) * distance;
        let hours = calculateHours(tmp);
        let minutes = calculateMinutes(tmp);
        let seconds = calculateSeconds(tmp);
        let travelTime = hours+':'+minutes+':'+seconds;
        if (minutes > 9 && seconds < 10) {
            travelTime = hours+':'+minutes+':'+'0'+seconds;
        }
        if (seconds > 9 && minutes < 10) {
            travelTime = hours+':'+'0'+minutes+':'+seconds;
        }
        if (minutes < 10 && seconds < 10) {
            travelTime = hours+':'+'0'+minutes+':'+'0'+seconds;
        }
       
        let homeArrival = calulateDistance(travelTime, arrivalTime, 'home');
        tmpArr.push({
            id: unitSpeeds[unitSpeedLength].id,
            title: unitSpeeds[unitSpeedLength].name,
            img: unitImageURL+unitSpeeds[unitSpeedLength].image,
            unit: unitSpeeds[unitSpeedLength].id,
            home: homeArrival,
            travel: travelTime,
        });
    }

    if (type === 'outter') {
        return tmpArr;
    }

    generateTable();
    for(let i = 0; i < tmpArr.length; ++i) {
        let startAttack = calulateDistance(tmpArr[i].travel, tmpArr[0].home, 'start');
        if (tmpArr[i].id !== 'militia') {
            generateRows(tmpArr[i].img, tmpArr[i].title, startAttack, tmpArr[i].travel, tmpArr[i].home);
        }
    }
}


function calculateHours(a) {
    return ~~(a / 60);
}


function calculateMinutes(a) {
    return ~~(a % 60);
}

function calculateSeconds(a) {
    return Math.round(a % 1 * 60);
}

function calulateDistance(a, b, options) {
    let bTimeData = b.split(':');
    let aTimeData = a.split(':');
    a = new Date('','','', aTimeData[0], aTimeData[1], aTimeData[2]);
    b = new Date('','','', bTimeData[0], bTimeData[1], bTimeData[2]);
 
    let hours, minutes, seconds;
    if (options === 'home') {
        hours = a.getHours() + b.getHours();
        minutes = a.getMinutes() + b.getMinutes();
        seconds = a.getSeconds() + b.getSeconds();
    }

    if (options === 'start') {
        hours = b.getHours() - a.getHours() ;
        minutes = b.getMinutes() - a.getMinutes();
        seconds = b.getSeconds() - a.getSeconds();
    }

    if ( minutes >= 60 ) 
    {
        hours++;
        minutes -= 60;
    }

    if ( hours >= 24 ) 
    {
        hours -= 24;
    }
    
    if(seconds >= 60) 
    {
        minutes += ~~(seconds / 60);
        seconds = ~~(seconds % 60)
    }

    return new Date('', '', '', hours, minutes, seconds).toTimeString().split(' ')[0];
}

function generateRows(img, title, startAttack, unitSpeed, homeArrival) {
    $(`#commands_incomings > table > tbody`).append(
        `<tr class="command-row no_ignored_command">
            <td>
                <span class="quickedit" >
                    <span class="quickedit-content">
                        <span class="icon-container">
                            <span class="">
                                <img src="${img}" title="${title}" alt="" class="">
                            </span>
                        </span>
                        <span class="quickedit-label">
                            ${title}
                        </span>
                    </span>
                </span>
            </td>
            <td><span class="">${unitSpeed}</span></td>
            <td><span class="">${startAttack}</span></td>
            <td><span class="">${homeArrival}</span></td>
        </tr>`
    );
}

function generateTable() {
    $('#content_value').append(
`<div id="backtiming" class="commands-container-outer" style="padding-bottom: 17px; padding-top: 17px;">
    <h3 style="clear: both">Hazakísérés</h3>
    <h4 style="padding-bottom: 5px;">(${a}) -> (${b})</h4>
        <div id="commands_incomings" style="width: 100%" class="commands-container">
            <table class="vis" style="width: 50%; float: left; padding-right: 40px;">
                <tbody>
                    <tr>
                        <th width="25%" colspan="1">Egységek</th>
                        <th width="25%" colspan="1">Menetidő</th>
                        <th width="25%" colspan="1">Indítás</th>
                        <th width="25%" colspan="1">Hazaérkezés</th>
                    </tr>
                </tbody>
            </table>
        </div>
</div>`
    );
}

function generateOutterStartAttack() {
    $('#commands_incomings').append(`
        <table id="second_backtiming" class="vis" style="width: 50%; float: left; padding-right: 40px;">
                <tbody>
                    <tr>
                        <th width="25%" colspan="1">Egységek</th>
                        <th width="25%" colspan="1">Menetidő</th>
                        <th width="25%" colspan="1">Indítás</th>
                    </tr>
                </tbody>
            </table>
    `)
}

function generateOutterStartAttackRows(img, title, startAttack, unitSpeed) {
    $(`#commands_incomings > table:nth-child(2) > tbody`).after(
        `<tr class="command-row no_ignored_command">
            <td>
                <span class="quickedit" >
                    <span class="quickedit-content">
                        <span class="icon-container">
                            <span class="">
                                <img src="${img}" title="${title}" alt="" class="">
                            </span>
                        </span>
                        <span class="quickedit-label">
                            ${title}
                        </span>
                    </span>
                </span>
            </td>
            <td><span class="">${unitSpeed}</span></td>
            <td><span class="">${startAttack}</span></td>
        </tr>`
    );
}

function init() {
    UnitPopup.fetchData();
    $('#header_info > tbody > tr > td:nth-child(1)').after(`
        <td align="right" class="topAlign">
            <table style="border-collapse: collapse;" class="header-border menu_block_right">
                <tbody>
                    <tr>
                        <td>
                            <table cellspacing="0" class="box">
                                <tbody>
                                    <tr>
                                        <td class="box-item firstcell nowrap">
                                        1. falu
                                        <input id="first_village" style="width: 40px;" type="text" name="input" class="target-input-field target-input-autocomplete ui-autocomplete-input" value="" placeholder="123|456">
                                        2. falu
                                        <input id="second_village" style="width: 40px;" type="text" name="input" class="target-input-field target-input-autocomplete ui-autocomplete-input" value="" placeholder="123|456">
                                        időpont
                                        <input id="incoming_attack_time" style="width: 42px;" type="text" name="input" class="target-input-field target-input-autocomplete ui-autocomplete-input" value="" placeholder="07:00:02">
                                        külső falu
                                        <input id="outter_village" style="width: 40px;" type="text" name="input" class="target-input-field target-input-autocomplete ui-autocomplete-input" value="" placeholder="123|456">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr class="newStyleOnly">
                        <td class="shadow">
                            <div class="leftshadow"> </div>
                            <div class="rightshadow"> </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>`
    );

}
init();

let a, b, c, arrivalTime;
$( "#first_village, #second_village, #incoming_attack_time, #outter_village").change(function(e) {
    if (e.target.id === 'first_village') {
        a = $(this).val();
    }
    if (e.target.id === 'second_village') {
        b = $(this).val();
    }
    if (e.target.id === 'outter_village') {
        c = $(this).val();
    }
    if (e.target.id === 'incoming_attack_time') {
        arrivalTime = $(this).val();
    }
    if (a && a.length === 7 && b && b.length === 7 && arrivalTime && arrivalTime.length === 8) {
        let unitsFromGame = Object.values(UnitPopup.unit_data);
        $('#backtiming').remove();
        distanceBetweenTwoVillage(a, b, arrivalTime, unitsFromGame, 'inner');
    }
    if (a && a.length === 7 && b && b.length === 7 && c && c.length === 7 && arrivalTime && arrivalTime.length === 8) {
        $('#second_backtiming').remove();
        generateOutterStartAttack();
        let unitsFromGame = Object.values(UnitPopup.unit_data);
        let allUnitsHomeArrivalData = distanceBetweenTwoVillage(c, b, arrivalTime, unitsFromGame, 'outter');

        for(let i = 0; i < allUnitsHomeArrivalData.length; ++i) {
            if (allUnitsHomeArrivalData[i].id !== 'militia') {
                generateOutterStartAttackRows(allUnitsHomeArrivalData[i].img, allUnitsHomeArrivalData[i].title, allUnitsHomeArrivalData[i].home, allUnitsHomeArrivalData[i].travel);
            }
        }
    }

});
