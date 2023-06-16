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
    
    document.getElementById("home-button").addEventListener("click", () => {
        window.location.href = "index.html";
    });
    
    document.getElementById("algorithm-select").addEventListener("change", () => {
        currentStep = 0;
        updateInstructions();
    });

    
      document.getElementById('refreshButton').addEventListener('click', function () {
  location.reload();
});
    document.getElementById("run-code").addEventListener("click", checkCode);
    
    updateVisualization();

document.getElementById("sort-button").disabled = true;
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
            togglePause(); // Unpause the visualization
            sort(); // Restart the sorting process
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
    
    function normalizeCode(code) {
        // Remove comments
        const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g;
        code = code.replace(commentRegex, '');

        // Remove whitespace and newlines
        const whitespaceRegex = /\s+/g;
        code = code.replace(whitespaceRegex, '');

        return code;
      }
    
    function checkCode() {
        const codeInput = document.getElementById("code-input").value;
        const language = document.getElementById("language-select").value;
        const selectedAlgorithm = document.getElementById("algorithm-select").value;

        // Predefined correct implementations for each language and algorithm
        const correctImplementations = {
            "bubble-sort": {
                java: 
`public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
         int temp = arr[j];
         arr[j] = arr[j + 1];
         arr[j + 1] = temp;
      }
    }
  }
}`,
                  
                c: 
`void bubbleSort(int arr[], int n) {
   int i, j;
   for (i = 0; i < n - 1; i++) {
   for (j = 0; j < n - i - 1; j++) {
   if (arr[j] > arr[j + 1]) {
       int temp = arr[j];
       arr[j] = arr[j + 1];
       arr[j + 1] = temp;
       }
     }
   }
 }`,
                  
                cpp: 
`void bubbleSort(vector<int>& arr) {
   int n = arr.size();
   for (int i = 0; i < n - 1; i++) {
   for (int j = 0; j < n - i - 1; j++) {
   if (arr[j] > arr[j + 1]) {
       int temp = arr[j];
       arr[j] = arr[j + 1];
       arr[j + 1] = temp;
      }
    }
  }
}`,
                  
                python:
`def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
    for j in range(0, n - i - 1):
    if arr[j] > arr[j + 1]:
          arr[j], arr[j + 1] = arr[j + 1], arr[j]
                  `,
            },
            "selection-sort": {
                java: 
`public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
         int minIndex = i;
         for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        int temp = arr[minIndex];
        arr[minIndex] = arr[i];
        arr[i] = temp;
    }
}
`,
                c: `void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n-1; i++) {
        min_idx = i;
        for (j = i+1; j <; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}
`,
                cpp: `void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n-1; i++) {
        min_idx = i;
        for (j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}
`,
                python: `def selectionSort(arr):
    n = len(arr)
    for i in range(n-1):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
`,
            },
            
            "insertion-sort": {
                java: `public static void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
`,
                c: `void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
`,
                cpp: `void insertionSort(int arr[], int n) {
    int i, key, j;
 for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j 1;
        }
        arr[j + 1] = key;
    }
}
`,
                python: `def insertionSort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
`,
            },
        };

        const normalizedInput = normalizeCode(codeInput);
        const normalizedCorrectImplementation = normalizeCode(correctImplementations[selectedAlgorithm][language]);

        if (normalizedInput === normalizedCorrectImplementation) {
            console.log("Correct implementation!");
           document.getElementById("sort-button").disabled = false;
            sort();
        } else {
            console.log("Incorrect implementation. Please try again.");
            document.getElementById("sort-button").disabled = true;
        }
    }


      const languageSelect = document.getElementById("language-select");
      const instructions = document.getElementById("instructions");
      const codeInput = document.getElementById("code-input");
      const previousStepButton = document.getElementById("previous-step");
      const nextStepButton = document.getElementById("next-step");
      const showCodeButton = document.getElementById("show-code");

      const languages = {
    		    java: {
    		        "bubble-sort": {
    		            steps: [
    		            	"1. Define a public static method called bubbleSort that takes an integer array (int[] arr) as input.",
        		        	"2. Declare an integer variable n and assign it the value of the length of the array arr. ",
        		        	"3. Start a for loop with the variable i initialized to 0 and the condition i < n - 1. ",
        		        	"4. Within the outer loop, start another for loop with the variable j initialized to 0 and the condition j < n - i - 1. ",
        		        	"5. Inside the inner loop, add an if statement to check if the current element (arr[j]) is greater than the next element (arr[j + 1]).",
        		        	"6. If the condition in the if statement is true, swap the elements. Create an integer variable temp and assign arr[j] to it. Then, assign arr[j + 1] to arr[j] and assign the value of temp to arr[j + 1].",
        		         
    		            ],
    		            code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
         int temp = arr[j];
         arr[j] = arr[j + 1];
         arr[j + 1] = temp;
      }
    }
  }
}`,
    		        },
    		        
    		        "selection-sort": {
    		            steps: [
    		                "1. Define a public static method called selectionSort that takes an integer array (int[] arr) as input.",
                            "2. Declare an integer variable n and assign it the value of the length of the array arr.",
                            "3. Start a for loop with the variable i initialized to 0 and the condition i < n - 1.",
                            "4. Within the outer loop, declare an integer variable minIndex and assign it the value of i.",
                            "5. Start another for loop with the variable j initialized to i + 1 and the condition j < n.",
                            "6. Inside the inner loop, add an if statement to check if the element at index j is less than the element at index minIndex.",
                            "7. If the condition in the if statement is true, update the value of minIndex to j.",
                            "8. After completing the inner loop, swap the minimum element with the element at index i. Create an integer variable temp and assign arr[minIndex] to it. Then, assign arr[i] to arr[minIndex] and assign the value of temp to arr[i].",
    		            ],
    		            code: 
`public static void selectionSort(int[] arr) {
int n = arr.length;
for (int i = 0; i < n-1; i++) {
     int minIndex = i;
     for (int j = i+1; j < n; j++) {
     if (arr[j] < arr[minIndex]) {
        minIndex = j;
            }
        }
        int temp = arr[minIndex];
        arr[minIndex] = arr[i];
        arr[i] = temp;
    }
}
`,
    		        },
    		        "insertion-sort": {
    		            steps: [
    		                "1. Define a public static method called insertionSort that takes an integer array (int[] arr) as input.",
    		                "2. Declare an integer variable n and assign it the value of the length of the array arr.",
                            "3. Start a for loop with the variable i initialized to 1 and the condition i < n.",
                            "4. Within the loop, declare an integer variable key and assign it the value of the current element at index i.",
                            "5. Declare an integer variable j and assign it the value of i - 1.",
                            "6. Start a while loop with the condition j >= 0 && arr[j] > key.",
                            "7. Inside the while loop, assign the value of the element at index j to the next position (arr[j + 1]).",
                            "8. Decrement j by 1 to continue comparing and shifting elements to the right.",
                            "9. After exiting the while loop, assign the value of the key to its correct position (arr[j + 1]).",
    		            ],
    		            code: 
`public static void insertionSort(int[] arr) {
 int n = arr.length;
 for (int i = 1; i < n; ++i) {
      int key = arr[i];
      int j = i - 1;
      while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
`,
    		        },
    		    },
    		    
    		    c: {
    		        "bubble-sort": {
    		            steps: [
    		             "1. Define a function called 'bubbleSort' that takes an integer array (int arr[]) and an integer n as input.",
    		   	         "2. Declare integer variables 'i' and 'j' to be used as loop counters.",
    		   	         "3. Start a for loop with the variable i initialized to 0 and the condition i < n - 1.",
    		   	         "4. Within the outer loop, start another for loop with the variable j initialized to 0 and the condition j < n - i - 1. ",
    		   	         "5. Inside the inner loop, add an if statement to check if the current element (arr[j]) is greater than the next element (arr[j + 1]).",
    		   	         "6. If the condition in the if statement is true, swap the elements. Create an integer variable temp and assign arr[j] to it. Then, assign arr[j + 1] to arr[j] and assign the value of temp to arr[j + 1].",
    		   	    
    		            ],
    		            code: `void bubbleSort(int arr[], int n) {
int i, j;
for (i = 0; i < n - 1; i++) {
for (j = 0; j < n - i - 1; j++) {
if (arr[j] > arr[j + 1]) {
   int temp = arr[j];
   arr[j] = arr[j + 1];
   arr[j + 1] = temp;
      }
    }
  }
}`,
    		        },
    		        
    		        "selection-sort": {
    		            steps: [
    		                "1. Define a void function called selectionSort that takes an integer array (int arr[]) and an integer n as input.",
                            "2. Declare integer variables i, j, and min_idx to be used as loop counters and for tracking the index of the minimum element.",
                            "3. Start a for loop with the variable i initialized to 0 and the condition i < n - 1.",
                            "4. Within the outer loop, assign the value of i to min_idx. This sets the current element as the assumed minimum.",
                            "5. Start another for loop with the variable j initialized to i + 1 and the condition j < n.",
                            "6. Inside the inner loop, add an if statement to check if the element at index j is less than the element at index min_idx.",
                            "7. If the condition in the if statement is true, update the value of min_idx to j.",
                            "8. After completing the inner loop, swap the minimum element with the element at index i. Create an integer variable temp and assign arr[min_idx] to it. Then, assign arr[i] to arr[min_idx] and assign the value of temp to arr[i].",
    		            ],
    		            code: 
`void selectionSort(int arr[], int n) {
 int i, j, min_idx;
 for (i = 0; i < n-1; i++) {
      min_idx = i;
      for (j = i+1; j <; j++) {
      if (arr[j] < arr[min_idx]) {
          min_idx = j;
            }
       }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}
`,
    		        },
    		        "insertion-sort": {
    		            steps: [
    		                "1. Define a void function called insertionSort that takes an integer array (int arr[]) and an integer n as input.",
                            "2. Declare integer variables i, key, and j to be used as loop counters",
                            "3. Start a for loop with the variable i initialized to 1 and the condition i < n.",
                            "4. Inside the loop, assign the value of arr[i] to key.",
                            "5. Assign the value of i - 1 to j.",
                            "6. Start a while loop with the condition j >= 0 && arr[j] > key.",
                            "7. Inside the while loop, assign the value of arr[j] to arr[j + 1].",
                            "8. Decrement j by 1 to continue comparing key with the previous elements.",
                            "9. After exiting the while loop, assign the value of key to arr[j + 1].",
     		            ],
    		            code:
`void insertionSort(int arr[], int n) {
int i, key, j;
for (i = 1; i < n; i++) {
     key = arr[i];
     j = i - 1;
     while (j >= 0 && arr[j] > key) {
           arr[j + 1] = arr[j];
           j = j - 1;
        }
        arr[j + 1] = key;
    }
}
`,
    		        },
    		    },
    		    
    		    cpp: {
    		        "bubble-sort": {
    		            steps: [
    		              "1. Define a function called bubbleSort that takes a reference to a vector of integers (vector<int>& arr) as input. ",
    		   		      "2. Declare an integer variable n and assign it the value of the size of the vector arr.",
    		   		      "3. Start a for loop with the variable i initialized to 0 and the condition i < n - 1.",
    		   		      "4. Within the outer loop, start another for loop with the variable j initialized to 0 and the condition j < n - i - 1.",
    		   		      "5. Inside the inner loop, add an if statement to check if the current element (arr[j]) is greater than the next element (arr[j + 1]).",
    		   		      "6. f the condition in the if statement is true, swap the elements. Create an integer variable temp and assign arr[j] to it. Then, assign arr[j + 1] to arr[j] and assign the value of temp to arr[j + 1].",
    		   		      
    		            ],
    		            code: `void bubbleSort(vector<int>& arr) {
   int n = arr.size();
   for (int i = 0; i < n - 1; i++) {
   for (int j = 0; j < n - i - 1; j++) {
   if (arr[j] > arr[j + 1]) {
       int temp = arr[j];
       arr[j] = arr[j + 1];
       arr[j + 1] = temp;
      }
    }
  }
}`,
    		        },
    		        
    		        "selection-sort": {
    		            steps: [
    		                "1. Define a void function called selectionSort that takes an integer array (int arr[]) and an integer n as input.",
                            "2. Declare integer variables i, j, and min_idx to be used as loop counters and for tracking the index of the minimum element.",
                            "3. Start a for loop with the variable i initialized to 0 and the condition i < n - 1.",
                            "4. Within the outer loop, assign the value of i to min_idx.",
                            "5. Start another for loop with the variable j initialized to i + 1 and the condition j < n.",
                            "6. Inside the inner loop, add an if statement to check if the element at index j is less than the element at index min_idx.",
                            "7. If the condition in the if statement is true, update the value of min_idx to j.",
                            "8. After completing the inner loop, swap the minimum element with the element at index i. Create an integer variable temp and assign arr[min_idx] to it. Then, assign arr[i] to arr[min_idx] and assign the value of temp to arr[i].",
    		            ],
    		            code: 
`void selectionSort(int arr[], int n) {
int i, j, min_idx;
for (i = 0; i < n-1; i++) {
    min_idx = i;
    for (j = i+1; j < n; j++) {
        if (arr[j] < arr[min_idx]) {
           min_idx = j;
            }
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}
`,
    		        },
    		        "insertion-sort": {
    		            steps: [
    		                "1. Define a void function called selectionSort that takes an integer array (int arr[]) and an integer n as input.",
"2. Declare integer variables i, j, and min_idx to be used as loop counters and for tracking the index of the minimum element.",
"3. Start a for loop with the variable i initialized to 0 and the condition i < n - 1.",
"4. Within the outer loop, assign the value of i to min_idx.",
"5. Start another for loop with the variable j initialized to i + 1 and the condition j < n.",
"6. Inside the inner loop, add an if statement to check if the element at index j is less than the element at index min_idx.",
"7. If the condition in the if statement is true, update the value of min_idx to j.",
"8. After completing the inner loop, swap the minimum element with the element at index i. Create an integer variable temp and assign arr[min_idx] to it. Then, assign arr[i] to arr[min_idx] and assign the value of temp to arr[i].",
    		            ],
    		            code: 
`void insertionSort(int arr[], int n) {
 int i, key, j;
 for (i = 1; i < n; i++) {
      key = arr[i];
      j = i - 1;
      while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j 1;
        }
        arr[j + 1] = key;
    }
}
`,
    		        },
    		    },
    		    
    		    python: {
    		        "bubble-sort": {
    		            steps: [
    		            	 "1. Define called bubble_sort that takes a list arr as input. ",
"2. Declare integer variables i, key, and j to be used as loop counters and for storing temporary values.",
"3. Start a for loop with the variable i initialized to 1 and the condition i < n.",
"4. Inside the loop, assign the value of arr[i] to key.",
"5. Assign the value of i - 1 to j.",
"6. Start a while loop with the condition j >= 0 && arr[j] > key.",
"7. Inside the while loop, assign the value of arr[j] to arr[j + 1].", 
"8. Decrement j by 1 to continue comparing key with the previous elements.",
"9. After exiting the while loop, assign the value of key to arr[j + 1].", 
		            ],
    		            code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
    for j in range(0, n - i - 1):
    if arr[j] > arr[j + 1]:
          arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    		        },
    		        
    		        "selection-sort": {
    		            steps: [
    		               "1. Define a function called selectionSort that takes a list arr as input.",
"2. Get the length of the list using the len() function and assign it to the variable n. ",
"3. Start a for loop with the variable i iterating over the range from 0 to n - 1. ", 
"4. Inside the outer loop, start another for loop with the variable j iterating over the range from 0 to n - i - 1.", 
"5. Add an if statement to check if the element at index j is greater than the element at index j + 1.",
"6. If the condition in the if statement is true, perform a simultaneous swap of the elements using tuple packing and unpacking: arr[j], arr[j + 1] = arr[j + 1], arr[j]. ", 		            ],
    		            code: 
`def selectionSort(arr):
 n = len(arr)
 for i in range(n-1):
    min_idx = i
    for j in range(i+1, n):
    if arr[j] < arr[min_idx]:
       min_idx = j
    arr[i], arr[min_idx] = arr[min_idx], arr[i]
`,
    		        },
    		        "insertion-sort": {
    		            steps: [
    		                "1. Define a function called insertionSort that takes a list arr as input. ",
"2. Start a for loop using the range() function to iterate over the indices of the list from 1 to the length of arr. ",
"3. Inside the loop, assign the value of arr[i] to the variable key. .",
"4. Assign the value of i - 1 to the variable j. ",
"5. Start a while loop with the condition j >= 0 and arr[j] > key. ",
"6. Inside the while loop, assign the value of arr[j] to arr[j + 1].",
"7. Decrement j by 1 to continue comparing key with the previous elements.",

    		            ],
    		            code: `def insertionSort(arr):
for i in range(1, len(arr)):
key = arr[i]
j = i - 1
while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j -= 1
      arr[j + 1] = key

`,
    		        },
    		    },
    		    
    		};

      
      let currentStep = 0;

      function updateInstructions() {
    	    const selectedAlgorithm = document.getElementById("algorithm-select").value;
    	    instructions.textContent = languages[languageSelect.value][selectedAlgorithm].steps[currentStep] || "You're done!";
    	}

    	function showCode() {
    	    const selectedAlgorithm = document.getElementById("algorithm-select").value;
    	    codeInput.value = languages[languageSelect.value][selectedAlgorithm].code;
    	}

      languageSelect.addEventListener("change", () => {
        currentStep = 0;
        updateInstructions();
      });

      previousStepButton.addEventListener("click", () => {
      	  if (currentStep > 0) {
      	    currentStep--;
      	    updateInstructions();
      	  }
      	});
      	
      nextStepButton.addEventListener("click", () => {
        currentStep++;
        updateInstructions();
      });

      showCodeButton.addEventListener("click", showCode);

      updateInstructions();
    