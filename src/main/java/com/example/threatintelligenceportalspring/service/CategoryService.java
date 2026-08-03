package com.example.threatintelligenceportalspring.service;

import com.example.threatintelligenceportalspring.entity.Category;

import java.util.List;

public interface CategoryService {

    Category addCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Integer id);

    Category updateCategory(Integer id, Category category);

    void deleteCategory(Integer id);

}