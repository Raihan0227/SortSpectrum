package com.sortspectrum17.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sortspectrum17.service.SortService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SortController {

	 @Autowired
	    private SortService sortService;

	    @PostMapping("/bubble-sort")
	    public List<List<Integer>> bubbleSort(@RequestBody List<Integer> data) {
	        return sortService.bubbleSort(data);
	    }
	    
	    @PostMapping("/selection-sort")
	    public List<List<Integer>> selectionSort(@RequestBody List<Integer> data) {
	        return sortService.selectionSort(data);
	    }
	    
	    @PostMapping("/insertion-sort")
	    public List<List<Integer>> insertionSort(@RequestBody List<Integer> data) {
	        return sortService.insertionSort(data);
	    }

}
