
$(document).ready(function () {

    var viewAs, bloc2kSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime, memoryMap
    // Value Sequence Builder
    var sequence = [];
    $("#addValues").click(function () {
        if ($("#input_mainMemoryMap").val() == "") {
            alert('Main Memory Values cannot be empty!');
        } 
        else {
            viewAs = $('input[name=flexRadioDefault]:checked', '#viewform').val();
        }

            // Get value fromt textbox
            var stringSequence = $("#input_mainMemoryMap").val();
            if (stringSequence.trim() != "") {

                // Valid Inputs
                $("#input_mainMemoryMap").removeClass("is-invalid");
                $("#input_mainMemoryMap").addClass("is-valid");

                // Separate each using comma
                var arraySequence = stringSequence.split(",");
                // Trim white spaces
                var noSpace = $.map(arraySequence, $.trim);


                var integerSequence = noSpace.map(function (x) {
                    return parseInt(x, 10);
                });

                // Check per element validity
                var elementsAreValid = true;
                for (var i = 0; i < integerSequence.length; i++) {
                    console.log(isNaN(integerSequence[i]))
                    if (elementsAreValid) {
                        if (!isNaN(integerSequence[i])) {
                            elementsAreValid = true;
                        }
                        else {
                            elementsAreValid = false;
                        }
                    }
                }

                if (elementsAreValid) {
                    // Get multiplier
                    var multiplier = parseInt($("#input_mainMemoryMult").val());
                    if (multiplier > 0) {
                        // Remove error messages
                        $("#input_mainMemoryMult").removeClass("is-invalid");

                        // Add to sequence
                        for (var i = 0; i < multiplier; i++) {
                            sequence = sequence.concat(integerSequence);
                        }

                        // Add to table 
                        $("#sequenceBody").empty();
                        for (var i = 0; i < sequence.length; i++) {
                            var row = "<tr> <td>" + i + "</td>" + "<td> " + sequence[i] + "</td> </tr>"
                            $("#sequenceBody").append(row);
                        }
                    }
                    else {
                        $("#input_mainMemoryMult").removeClass("is-valid");
                        $("#input_mainMemoryMult").addClass("is-invalid");
                    }
                }
                else {
                    $("#input_mainMemoryMap").removeClass("is-valid");
                    $("#input_mainMemoryMap").addClass("is-invalid");
                }

            }
            else {
                $("#input_mainMemoryMap").removeClass("is-valid");
                $("#input_mainMemoryMap").addClass("is-invalid");
            }
        }

        console.log(sequence);
    });

    $("#submitInputs").click(function () {
        viewInputAs = $('input[name=flexRadioDefault]:checked', '#viewform').val();
        viewSizeAs = $('input[name=radioUnit]:checked', '#viewformSize').val();
        block2kSize = parseInt($("#input_blocksize").val());
        mainMemorySize = parseInt($("#input_mmsize").val());
        cacheMemorySize = parseInt($("#input_cmsize").val());
        /*
        if (viewSizeAs == 'block') {
            mainMemorySize = parseInt($("#input_mmsize").val());
            cacheMemorySize = parseInt($("#input_cmsize").val());
        }
        else {
            mainMemorySize = parseInt($("#input_mmsize").val()) / block2kSize;
            cacheMemorySize = parseInt($("#input_cmsize").val()) / block2kSize;
        }
        */
        mainMemoryMap = sequence;
        memAccessTime = parseFloat($("#input_memaccesstime").val());
        cacheAccessTime = parseFloat($("#input_cacheaccesstime").val());
        console.log(viewSizeAs);

        // Validation
        let validConfig = viewSizeAs === 'word' && validDivisible(block2kSize, mainMemorySize, cacheMemorySize) || viewSizeAs === 'block';

        var validBlock2kSize = validConfig;
        var validmainMemorySize = validConfig;
        var validcacheMemorySize = validConfig;
        var validmemAccessTime = checkPositive(memAccessTime);
        var validcacheAccessTime = checkPositive(cacheAccessTime);
        var validAll = validBlock2kSize && validmainMemorySize && validcacheMemorySize && validmemAccessTime && validcacheAccessTime;

        // console.log(validBlock2kSize + " " + validmainMemorySize + " " + validcacheMemorySize + " " + validmemAccessTime + " " + validcacheAccessTime + " ");
        // Block Size Validation
        if (validBlock2kSize) {
            $("#input_blocksize").removeClass("is-invalid");
            $("#input_blocksize").addClass("is-valid");
        }
        else {
            $("#input_blocksize").addClass("is-invalid");
            $("#input_blocksize").removeClass("is-valid");
        }

        // Main Memory Size Validation
        if (validmainMemorySize) {
            $("#input_mmsize").removeClass("is-invalid");
            $("#input_mmsize").addClass("is-valid");
        }
        else {
            $("#input_mmsize").addClass("is-invalid");
            $("#input_mmsize").removeClass("is-valid");
        }

        // Cache Memory Size Validation
        if (validcacheMemorySize) {
            $("#input_cmsize").removeClass("is-invalid");
            $("#input_cmsize").addClass("is-valid");
        }
        else {
            $("#input_cmsize").addClass("is-invalid");
            $("#input_cmsize").removeClass("is-valid");
        }

        // Memory Access Time Validation
        if (validmemAccessTime) {
            $("#input_memaccesstime").removeClass("is-invalid");
            $("#input_memaccesstime").addClass("is-valid");
        }
        else {
            $("#input_memaccesstime").addClass("is-invalid");
            $("#input_memaccesstime").removeClass("is-valid");
        }

        // Memory Access Time Validation
        if (validcacheAccessTime) {
            $("#input_cacheaccesstime").removeClass("is-invalid");
            $("#input_cacheaccesstime").addClass("is-valid");
        }
        else {
            $("#input_cacheaccesstime").addClass("is-invalid");
            $("#input_cacheaccesstime").removeClass("is-valid");
        }

        if (validAll) {
            simulation(viewInputAs, viewSizeAs, block2kSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime)
            submit();
        }
        else {
            alert("Please fix the errors indicated.");
        }

    });

    function checkPositive(value) {
        return value > 0;
    }

    function powerOfTwo(x) {
        return (Math.log(x) / Math.log(2)) % 1 === 0;
    }

    function validDivisible(blockSize, mainMemorySize, cacheMemorySize) {
        console.log(cacheMemorySize % blockSize, mainMemorySize % blockSize)
        return cacheMemorySize % blockSize === 0 && mainMemorySize % blockSize === 0;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $("#gooutput").click(function () {
        $(".input-card").hide();
        $(".output-card").show();
        $(".simulation-card").hide();
        $(".retry-button").show();
        $(".poutput-button").hide();

        directMap = simulate(viewInputAs, viewSizeAs, block2kSize, mainMemorySize, cacheMemorySize, memoryMap, memAccessTime, cacheAccessTime);
        printVals(directMap)
    });

    async function simulation(viewInputAs, viewSizeAs, blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime) {
        memoryMap = mainMemoryMap
        directMap = simulate(viewInputAs, viewSizeAs, blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime);
        console.log(directMap)
        snapshots = directMap.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#simulationTable").empty()
        $("#inputSimulation").empty()

        for (var x = 0; x < cacheSize; x++) {
            $("#simulationTable").append("<tr> <th scope=\"row\">" + x + "</th><td id=\"block" + x + "\" class=\"text-right\"></td> </tr>");
            $("#block" + x).val('E');
        }

        for (var x = 0; x < memoryMap.length; x++) {
            $("#inputSimulation").append("<div class=\"text-center col\" id=\"input" + x + "\">" + memoryMap[x] + "</div>");
        }

        $("#simulation-body").prop('hidden', false);

        for (var y = 0; y < snapshots.length; y++) {
            for (var x = 0; x < cacheSize; x++) {
                var text = $("#block" + x).val();

                if (snapshots[y][x] != null) {
                    $("#block" + x).text(snapshots[y][x]);
                    $("#block" + x).val(snapshots[y][x]);
                }

                if (memoryMap[y] == snapshots[y][x])
                    $("#block" + x).attr('style', 'color:de9918');
                else
                    $("#block" + x).attr('style', 'color:black');

                if (snapshots[y][x] == text && memoryMap[y] == text) {
                    hits = parseInt($("#hits").text())
                    hits++
                    $("#block" + x).text("HIT! " + snapshots[y][x]);
                    $("#hits").text(hits)
                }
                else if (snapshots[y][x] != text && memoryMap[y] == snapshots[y][x]) {
                    misses = parseInt($("#misses").text())
                    misses++
                    $("#block" + x).text("MISS " + snapshots[y][x]);
                    $("#misses").text(misses)
                }
            }
            $("#input" + y).attr('style', 'color:ebba34');
            await sleep(2000);

        }

        for (var x = 0; x < cacheSize; x++) {
            $("#block" + x).attr('style', 'color:black');
            if (snapshots[memoryMap.length - 1][x] != null)
                $("#block" + x).text(snapshots[memoryMap.length - 1][x]);
            else
                $("#block" + x).text('E');
        }
    };

    function printVals(directMap) {
        snapshots = directMap.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#output-body").append('<p class="card-text"><b>Number of Cache Hits:</b> ' + directMap.cacheHit + '</p>')
        $("#output-body").append('<p class="card-text"><b>Number of Cache Miss:</b> ' + directMap.cacheMiss + '</p>')
        $("#output-body").append('<p class="card-text"><b>Miss Penalty (seconds):</b> ' + directMap.missPenalty + '</p>')
        $("#output-body").append('<p class="card-text"><b>Average Memory Access Time (seconds):</b> ' + directMap.aveAccessTime + '</p>')
        $("#output-body").append('<p class="card-text"><b>Total Memory Access Time (seconds):</b> ' + directMap.totalAccessTime + '</p>')
        $("#output-body").append('<p class="card-text"><b>Final Snapshot of Cache Memory:</p>')
        $("#output-body").append("<div class=\"row\"><div class=\"col\"><table class=\"table\" style='width: 40%'><thead class=\"thead-dark\"><tr><th scope=\"col\">Block Number</th><th scope=\"col\">Data</th></tr></thead><tbody id='snapshotTable'></tbody></table></div></div>")
        for (var x = 0; x < cacheSize; x++) {
            if (snapshots[memoryMap.length - 1][x] != null)
                $("#snapshotTable").append("<tr> <th scope=\"row\">" + x + "</th><td>" + snapshots[memoryMap.length - 1][x] + "</td> </tr>");
            else
                $("#snapshotTable").append("<tr> <th scope=\"row\">" + x + "</th><td>E</td> </tr>");
        }
    }

});
// console.log(convertToBlock(4, 64, 4, ['111', '110011', '11001001']));
function convertToBlock(blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap) {
    const w = Math.log2(blockSize);
    const k = Math.log2(cacheMemorySize);

    const tag = mainMemorySize - w - k;
    let convertedMap = [];

    /*
    for (var i = 0; i < mainMemoryMap.length; i++) {
        var stringBinary = mainMemoryMap[i].toString();
        var removeWord = stringBinary.slice(0, 0 - w);
        var binaryString = removeWord.slice(0 - k);
        var integerValue = parseInt(binaryString, 2);
        mainMemoryMap[i] = integerValue;
    } */
    mainMemoryMap.forEach(loc => {
        //console.log(loc, parseInt(loc,2), parseInt(loc,2) >>> w, (parseInt(loc,2) >>> w).toString(2), (parseInt(loc,2) >>> w) % cacheMemorySize, ((parseInt(loc,2) >>> w) % cacheMemorySize).toString(2))
        convertedMap.push((parseInt(loc,2) >>> w) % cacheMemorySize)
    });

    return { mainMemorySize, cacheMemorySize, convertedMap };
}

/**
 * Simulates the cache mapping function
 * @param {String} viewInputAs Either as 'address' or as 'block'
 * @param {String} viewSizeAs Either as 'block' or as 'word'
 * @param {Number} blockSize Integer power of 2 that represents block size in words
 * @param {Number} mainMemorySize Integer power of 2 that represents the size of a memory block in bits
 * @param {Number} cacheMemorySize Integer power of 2 that represents the cache size in words
 * @param {Array} mainMemoryMap Array of integers that represent the blocks or addresses to be mapped
 * @param {Number} memAccessTime Number that represents the time taken to access the main memory. Keep unit the same as cacheAccessTime
 * @param {Number} cacheAccessTime Number that represents the time taken to access the cache memory. Keep unit the same as memAccessTime
 */
function simulate(viewInputAs, viewSizeAs, blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap, memAccessTime, cacheAccessTime) {

    let cacheHit = 0,
        cacheMiss = 0,
        missPenalty = (cacheAccessTime + memAccessTime) * 2,
        aveAccessTime,
        totalAccessTime = 0,
        cacheSnapshot = [],
        mainMemoryBlockMap;

    if (viewSizeAs === 'word') {
        mainMemorySize = mainMemorySize / blockSize;
        cacheMemorySize = cacheMemorySize / blockSize;
    }

    if (viewInputAs === 'address') {
        convResult = convertToBlock(blockSize, mainMemorySize, cacheMemorySize, mainMemoryMap);
        mainMemoryBlockMap = convResult.convertedMap;
    } else {
        mainMemoryBlockMap = mainMemoryMap;
    }

    let cache = Array(cacheMemorySize).fill(null);

    mainMemoryBlockMap.forEach((blockNum, i) => {
        let blockMap = blockNum % cacheMemorySize;

        if (cache[blockMap] === null || cache[blockMap] !== blockNum) {
            cacheMiss += 1;
        } else {
            cacheHit += 1;
        }

        cache[blockMap] = mainMemoryMap[i];
        cacheSnapshot.push([...cache]);
    });
    console.log(cacheSnapshot)

    aveAccessTime = (cacheHit / (cacheHit + cacheMiss)) * cacheAccessTime +
        (cacheMiss / (cacheHit + cacheMiss)) * missPenalty;

    totalAccessTime = cacheHit * 2 * cacheAccessTime +
        cacheMiss * 2 * (memAccessTime + cacheAccessTime) +
        cacheMiss * cacheAccessTime;
    return { cacheHit, cacheMiss, missPenalty, aveAccessTime, totalAccessTime, cacheSnapshot }
}

// BUG: Input moves to simulation even when input is invalod
// TODO: Redo input confirmation to make sure that memorysize is divisible by block size instead
// FIXME: bug for view as address
