 var data = [50, 30, 3, 40, 6, 80, 23, 90];
    var width = 500;
    var height = 300;
    var barWidth = width / data.length;
    var speed = 1000;
    var isPaused = false;

    var svg = d3.select(".visualization");

    function xScale(index) {
        return index * barWidth ;
    }
   
 
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);

    document.getElementById("sort-button").addEventListener("click", sort);
    document.getElementById("pause-button").addEventListener("click", togglePause);
    document.getElementById("update-array").addEventListener("click", updateArray);
    document.getElementById("speed-slider").addEventListener("input", updateSpeed);
    document.getElementById("compare-button").addEventListener("click", () => {
        window.location.href = "compare.html";
    });
     document.getElementById("learn-button").addEventListener("click", () => {
        window.location.href = "learning.html";
    });
    document.getElementById('refreshButton').addEventListener('click', function () {
  location.reload();
});

    updateVisualization();

    function findSwappedIndices(prevStep, currStep) {
        for (let i = 0; i < prevStep.length; i++) {
            if (prevStep[i] !== currStep[i]) {
                return [i, i + 1];
            }
        }
        return [-1, -1];
    }

    async function bubbleSort() {
        document.getElementById("sort-button").disabled = true;
        const stepsList = document.getElementById("steps-list");
        stepsList.innerHTML = ""; // Clear previous steps

        const response = await fetch('/api/bubble-sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const steps = await response.json();
        let prevStep = data;
        for (const step of steps) {
            const [index1, index2] = findSwappedIndices(prevStep, step);

            // Add the current step to the steps list
            const listItem = document.createElement("li");
            listItem.textContent = `Swapping ${prevStep[index1]} and ${prevStep[index2]}`;
            stepsList.appendChild(listItem);

            svg.selectAll("rect")
                .filter((d, i) => i === index1 || i === index2)
                .classed("swapping", true);

            while (isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            await new Promise(resolve => setTimeout(resolve, speed));

            svg.selectAll("rect")
                .data(step)
                .attr("y", function (d) {
                    return yScale(d);
                })
                .attr("height", function (d) {
                    return height - yScale(d);
                });

            svg.selectAll("text")
                .data(step)
                .attr("y", function (d) {
                    return yScale(d) + (height - yScale(d)) / 2 + 5;
                })
                .text(function (d) {
                    return d;
                });

            svg.selectAll("rect")
                .filter((d, i) => i === index1 || i === index2)
                .classed("swapping", false);

            prevStep = step;
            await new Promise(resolve => setTimeout(resolve, speed));
        }
        document.getElementById("sort-button").disabled = false;
    }

    async function selectionSort() {
        document.getElementById("sort-button").disabled = true;
        const stepsList = document.getElementById("steps-list");
        stepsList.innerHTML = ""; // Clear previous steps

        const response = await fetch('/api/selection-sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const steps = await response.json();

        const rects = svg.selectAll("rect");
        const texts = svg.selectAll("text");

        for (const step of steps) {
        	
        	  
            if (isPaused) {
                await new Promise(resolve => {
                    const interval = setInterval(() => {
                        if (!isPaused) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 100);
                });
            }

            const [i, j, minIndex, isSwapping] = step;
            

            // Color the compared elements red
            rects.filter((_, index) => index === i || index === j).attr("fill", "red");

            await new Promise(resolve => setTimeout(resolve, speed));

            // Color the minimum element green
            rects.filter((_, index) => index === minIndex).attr("fill", "green");

            await new Promise(resolve => setTimeout(resolve, speed));

            if (isSwapping) {
                // Swap the elements
                const tempData = [...data];
                tempData[i] = data[minIndex];
                tempData[minIndex] = data[i];
                data = tempData;

                rects.data(data)
                    .attr("y", d => yScale(d))
                    .attr("height", d => height - yScale(d));

                texts.data(data)
                    .attr("y", d => yScale(d) + (height - yScale(d)) / 2 + 5)
                    .text(d => d);

                const listItem = document.createElement("li");
                listItem.textContent =`Select ${data[i]} and Swap with ${data[minIndex]}`;
                stepsList.appendChild(listItem);
            }
            // Color the compared elements yellow if they are larger than the minimum element
            if (j !== minIndex) {
                rects.filter((_, index) => index === j).attr("fill", "yellow");
            }

            // Reset the colors
            rects.attr("fill", "steelblue");
            texts.attr("fill", "black");
            await new Promise(resolve => setTimeout(resolve, speed));
           
        }
        document.getElementById("sort-button").disabled = false;
    }
    

    async function insertionSort() {
        document.getElementById("sort-button").disabled = true;
        const stepsList = document.getElementById("steps-list");
        stepsList.innerHTML = ""; // Clear previous steps

        console.log("Initial array:", data);
        const response = await fetch('/api/insertion-sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const steps = await response.json();

        let stepNumber = 1;
        for (const step of steps) {
        	
        	 if (isPaused) {
                 await new Promise(resolve => {
                     const interval = setInterval(() => {
                         if (!isPaused) {
                             clearInterval(interval);
                             resolve();
                         }
                     }, 100);
                 });
             }
        	 
            const i = step[0];
            const j = step[1];
            const key = step[2];

            const listItem = document.createElement("li");
            listItem.textContent =`Step ${stepNumber}: Insert ${key} at index ${j}`;
            stepsList.appendChild(listItem);
            stepNumber++;
            // Turn the current pair orange
            svg.selectAll("rect")
                .filter((d, index) => index === i || index === j)
                .attr("fill", "orange");
            await new Promise(resolve => setTimeout(resolve, speed));
            
            if(i<j){
            	 svg.selectAll("rect")
                 .filter((d, index) => index === j)
                 .attr("fill", "green");
             await new Promise(resolve => setTimeout(resolve, speed));
             
            }
            else {svg.selectAll("rect")
                 .filter((d, index) => index === i)
                 .attr("fill", "green");
             await new Promise(resolve => setTimeout(resolve, speed));}

            // Update the data array based on the step
            data = step.slice(3);

            // Redraw the bars and texts based on the updated data
            updateVisualization();

            // Reset the colors
            svg.selectAll("rect")
                .attr("fill", "steelblue");

            console.log("after:" + step);
        }

        document.getElementById("sort-button").disabled = false;
    }
    
    function togglePause() {
        isPaused = !isPaused;
        document.getElementById("shuffle-array-button").disabled = !isPaused;
        document.getElementById("shuffle-array-input").value = isPaused ? data.join(', ') : '';
        document.getElementById("shuffle-array-input").disabled = !isPaused;
    }


    function updateArray() {
        const input = document.getElementById("array-input").value;
        const inputArray = input.split(',').map(Number).filter(num => !isNaN(num));

        if (inputArray.length > 0) {
            data = inputArray;
            updateVisualization();
        } else {
            alert("Please enter a valid comma-separated list of integers.");
        }
    }

    function shuffleArray() {
        const input = document.getElementById("shuffle-array-input").value;
        const inputArray = input.split(',').map(Number).filter(num => !isNaN(num));

        if (inputArray.length > 0) {
            data = inputArray;
            updateVisualization();
            sort();
        } else {
            alert("Please enter a valid comma-separated list of integers.");
        }
    }

    
    function updateSpeed() {
        speed = parseInt(document.getElementById("speed-slider").value);
    }

    function updateVisualization() {
        barWidth = width / data.length;

        yScale.domain([0, d3.max(data)]);

        const bars = svg.selectAll("rect").data(data);
        const texts = svg.selectAll("text").data(data);

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("x", function(d, i) {
                return i * barWidth;
            })
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("width", barWidth - 1)
            .attr("height", function(d) {
                return height - yScale(d);
            })
            .attr("fill", "steelblue");

        texts.enter()
            .append("text")
            .merge(texts)
            .attr("x", function(d, i) {
                return i * barWidth + barWidth / 2;
            })
            .attr("y", function(d) {
                return yScale(d) + (height - yScale(d)) / 2 + 5;
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d;
            });

        bars.exit().remove();
        texts.exit().remove();
    }
    
    function sort() {
        const algorithmSelect = document.getElementById("algorithm-select");
        const selectedAlgorithm = algorithmSelect.value;

        switch (selectedAlgorithm) {
            case "bubble-sort":
                bubbleSort();
                break;
            case "selection-sort":
                selectionSort();
                break;
            case "insertion-sort":
            	insertionSort();
                break;
            default:
                alert("Please select a valid sorting algorithm.");
        }
    }