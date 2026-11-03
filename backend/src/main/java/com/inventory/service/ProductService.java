
package com.inventory.service;

import com.inventory.dao.ProductDAO;
import com.inventory.database_system.entity.Product;
import com.inventory.service.validation.ProductValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductDAO productDAO;
    private final ProductValidator validator;

    public ProductService(ProductDAO productDAO, ProductValidator validator) {
        this.productDAO = productDAO;
        this.validator = validator;
    }

    public void addProduct(Product product) {
        validator.validate(product);
        productDAO.addProduct(product);
    }

    @Transactional
    public void updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = productDAO.getProductById(id);

        updatedProduct.setId(id);
        validator.validate(updatedProduct);

        // Check duplicate SKU
        productDAO.findBySku(updatedProduct.getSku())
                .ifPresent(found -> {
                    if (!found.getId().equals(id)) {
                        throw new RuntimeException("SKU already exists");
                    }
                });

        // Update existing product
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setSku(updatedProduct.getSku());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setReorderLevel(updatedProduct.getReorderLevel());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setSupplier(updatedProduct.getSupplier());

        productDAO.updateProduct(existingProduct);
    }

    public List<Product> getAllProducts() {
        return productDAO.getAllProducts();
    }

    public List<Product> getActiveProducts() {
        return productDAO.getActiveProducts();
    }

    public Product getProduct(Long id) {
        return productDAO.getProductById(id);
    }

    public List<Product> searchByName(String name) {
        return productDAO.searchByName(name);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productDAO.getProductsByCategory(categoryId);
    }

    public List<Product> getProductsBySupplier(Long supplierId) {
        return productDAO.getProductsBySupplier(supplierId);
    }

    public void deleteProduct(Long id) {
        productDAO.deleteProduct(id);
    }

    public void deactivateProduct(Long id) {
        productDAO.deactivateProduct(id);
    }
}
