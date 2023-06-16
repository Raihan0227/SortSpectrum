package com.sortspectrum17.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class SortService {


    public List<List<Integer>> bubbleSort(List<Integer> value) {
        int n = value.size();
        List<List<Integer>> stepCount = new ArrayList<>();

        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (value.get(j) > value.get(j + 1)) {
                    int temp = value.get(j);
                    value.set(j, value.get(j + 1));
                    value.set(j + 1, temp);
                    stepCount.add(new ArrayList<>(value));
                }
            }
        }
        return stepCount;
    }
    
    public List<List<Integer>> selectionSort(List<Integer> value) {
        List<List<Integer>> stepCount = new ArrayList<>();
        int n = value.size();

        for (int i = 0; i < n-1 ; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                stepCount.add(List.of(i, j, minIndex, 0)); // Add step for comparison
                if (value.get(j) < value.get(minIndex)) {
                    minIndex = j;
                }
            }

            if (minIndex != i) {
                int temp = value.get(minIndex);
                value.set(minIndex, value.get(i));
                value.set(i, temp);
            stepCount.add(List.of(i, minIndex, minIndex, 1)); // Add step for swapping
            }
        }

        return stepCount;
    }
    
        public List<List<Integer>> insertionSort(List<Integer> value) {
            List<List<Integer>> stepCount = new ArrayList<>();
            for (int i = 1; i < value.size(); i++) {
                int key = value.get(i);
                int j = i - 1;
                boolean hasChanged = false;
                while (j >= 0 && value.get(j) > key) {
                    value.set(j + 1, value.get(j));
                    j = j - 1;
                    hasChanged = true;
                }
                value.set(j + 1, key);
                if (hasChanged) {
                    List<Integer> step = new ArrayList<>(Arrays.asList(i, j + 1, key));
                    step.addAll(value);
                    stepCount.add(step);
                }
            }
            return stepCount;
        }
    }



