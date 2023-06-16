 var data1 = [50, 30, 3, 40, 6, 80, 23, 90];
    var data2 = [50, 30, 3, 40, 6, 80, 23, 90];

var     width = 500;
    var height = 300;
    var barWidth = width / data1.length;
    var speed = 1000;
    var isPaused = false;

    var svg1 = d3.select("#visualization1");
    var svg2 = d3.select("#visualization2");

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data1)])
        .range([height, 0]);

    document.getElementById("home-button").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    document.getElementById("compare").addEventListener("click", () => {
        window.location.href = "compare.html";
    });

    document.getElementById("sort-button").addEventListener("click", sort);

    document.getElementById("pause-button").addEventListener("click", togglePause);
    
    document.getElementById('refreshButton').addEventListener('click', function () {
  location.reload();
});
    updateVisualization1();
    updateVisualization2();
    
    function findSwappedIndices(prevStep, currStep) {
        for (let i = 0; i < prevStep.length; i++) {
            if (prevStep[i] !== currStep[i]) {
                return [i, i + 1];
            }
        }
        return [-1, -1];
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
            body: JSON.stringify(data1)
        });

        const steps = await response.json();

        const rects = svg1.selectAll("rect");
        const texts = svg1.selectAll("text");

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

            await new Promise(resolve => setTimeout(resolve, speed-800));

            // Color the minimum element green
            rects.filter((_, index) => index === minIndex).attr("fill", "green");

            await new Promise(resolve => setTimeout(resolve, speed-800));

            if (isSwapping) {
                // Swap the elements
                const tempData = [...data1];
                tempData[i] = data1[minIndex];
                tempData[minIndex] = data1[i];
                data1 = tempData;

                rects.data(data1)
                    .attr("y", d => yScale(d))
                    .attr("height", d => height - yScale(d));

                texts.data(data1)
                    .attr("y", d => yScale(d) + (height - yScale(d)) / 2 + 5)
                    .text(d => d);

                const listItem = document.createElement("li");
                listItem.textContent =`Select ${data1[i]} and Swap with ${data1[minIndex]}`;
                stepsList.appendChild(listItem);
            }
            // Color the compared elements yellow if they are larger than the minimum element
            if (j !== minIndex) {
                rects.filter((_, index) => index === j).attr("fill", "yellow");
            }

            // Reset the colors
            rects.attr("fill", "steelblue");
            texts.attr("fill", "black");

           
            await new Promise(resolve => setTimeout(resolve, speed-800));
        }
        document.getElementById("sort-button").disabled = false;
    }

    async function insertionSort() {
        document.getElementById("sort-button").disabled = true;
        const stepsList = document.getElementById("steps-list2");
        stepsList.innerHTML = ""; // Clear previous steps

        const response = await fetch('/api/insertion-sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
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
            svg2.selectAll("rect")
                .filter((d, index) => index === i || index === j)
                .attr("fill", "orange");
            await new Promise(resolve => setTimeout(resolve, speed));
            
            if(i<j){
            	 svg2.selectAll("rect")
                 .filter((d, index) => index === j)
                 .attr("fill", "green");
             await new Promise(resolve => setTimeout(resolve, speed));
             
            }
            else {svg2.selectAll("rect")
                 .filter((d, index) => index === i)
                 .attr("fill", "green");
             await new Promise(resolve => setTimeout(resolve, speed));}

            // Update the data array based on the step
            data2 = step.slice(3);

            
            
            // Redraw the bars and texts based on the updated data
            updateVisualization2();

            // Reset the colors
            svg2.selectAll("rect")
                .attr("fill", "steelblue");

        }

        document.getElementById("sort-button").disabled = false;
    }
    


    function togglePause() {
        isPaused = !isPaused;
        document.getElementById("shuffle-array-button").disabled = !isPaused;
        document.getElementById("shuffle-array-input").value = isPaused ? data.join(', ') : '';
        document.getElementById("shuffle-array-input").disabled = !isPaused;
    }

    function updateVisualization1() {
        barWidth = width / data1.length;

        yScale.domain([0, d3.max(data1)]);

        const bars = svg1.selectAll("rect").data(data1);
        const texts = svg1.selectAll("text").data(data1);

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

    function updateVisualization2() {
    	  barWidth = width / data2.length;

    	  yScale.domain([0, d3.max(data2)]);

    	  const bars = svg2.selectAll("rect").data(data2);
    	  const texts = svg2.selectAll("text").data(data2);

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
    	  const algorithmSelect1 = document.getElementById("algorithm-select");
    	  const selectedAlgorithm1 = algorithmSelect1.value;

    	  const algorithmSelect2 = document.getElementById("algorithm-select2");
    	  const selectedAlgorithm2 = algorithmSelect2.value;

    	  switch (selectedAlgorithm1) {
    	    case "selection-sort":
    	      selectionSort();
    	      break;
    	    default:
    	      alert("Please select a valid sorting algorithm for the first visualization.");
    	  }

    	  switch (selectedAlgorithm2) {
    	    case "bubble-sort":
    	      insertionSort();
    	      break;
    	    default:
    	      alert("Please select a valid sorting algorithm for the second visualization.");
    	  }
    	}
