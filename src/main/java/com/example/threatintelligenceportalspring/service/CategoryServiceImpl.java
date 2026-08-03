package com.example.threatintelligenceportalspring.service;

import com.example.threatintelligenceportalspring.entity.Category;
import com.example.threatintelligenceportalspring.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category addCategory(Category category) {

        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Category already exists.");
        }

        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Integer id) {

        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));
    }

    @Override
    public Category updateCategory(Integer id, Category category) {

        Category existingCategory = getCategoryById(id);

        if (!existingCategory.getCategoryName().equalsIgnoreCase(category.getCategoryName())
                && categoryRepository.existsByCategoryName(category.getCategoryName())) {

            throw new RuntimeException("Category already exists.");

        }

        existingCategory.setCategoryName(category.getCategoryName());
        existingCategory.setDescription(category.getDescription());

        return categoryRepository.save(existingCategory);

    }

    @Override
    public void deleteCategory(Integer id) {

        Category category = getCategoryById(id);
        categoryRepository.delete(category);

    }

}