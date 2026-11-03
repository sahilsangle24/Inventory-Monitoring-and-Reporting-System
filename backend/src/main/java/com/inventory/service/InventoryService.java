
package com.inventory.service;

import com.inventory.dao.ProductDAO;
import com.inventory.dao.TransactionDAO;
import com.inventory.database_system.entity.Product;
import com.inventory.database_system.entity.Transaction;
import com.inventory.Report.InventoryReportService;
import com.inventory.service.validation.InventoryValidator;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    private final ProductDAO productDAO;
    private final TransactionDAO transactionDAO;
    private final InventoryValidator validator;
    private final InventoryReportService reportService;

    public InventoryService(
            ProductDAO productDAO,
            TransactionDAO transactionDAO,
            InventoryValidator validator,
            InventoryReportService reportService) {

        this.productDAO = productDAO;
        this.transactionDAO = transactionDAO;
        this.validator = validator;
        this.reportService = reportService;
    }

    // REDUCE STOCK
    @Transactional
    public void reduceStock(Long id, int quantity) {

        System.out.println(
            "[Inventory] Reducing stock | ID: " + id + ", Qty: " + quantity
        );

        validator.validateQuantity(quantity);

        Product product = productDAO.getProductById(id);

        validator.validateProductExists(product, id.intValue());

        validator.validateStock(product.getQuantity(), quantity);

        int newQuantity = product.getQuantity() - quantity;

        // Update product quantity
        productDAO.updateStock(id, newQuantity);

        // Save transaction history
        Transaction transaction = new Transaction(
            null,
            product,
            "REDUCE",
            quantity,
            null
        );

        transactionDAO.saveTransaction(transaction);

        System.out.println(
            "[Inventory] Stock reduced | New Quantity: " + newQuantity
        );

        reportService.checkAndSendLowStockAlert();
    }

    // INCREASE STOCK
    @Transactional
    public void increaseStock(Long id, int quantity) {

        System.out.println(
            "[Inventory] Increasing stock | ID: " + id + ", Qty: " + quantity
        );

        validator.validateQuantity(quantity);

        Product product = productDAO.getProductById(id);

        validator.validateProductExists(product, id.intValue());

        int newQuantity = product.getQuantity() + quantity;

        // Update product quantity
        productDAO.updateStock(id, newQuantity);

        // Save transaction history
        Transaction transaction = new Transaction(
            null,
            product,
            "INCREASE",
            quantity,
            null
        );

        transactionDAO.saveTransaction(transaction);

        System.out.println(
            "[Inventory] Stock increased | New Quantity: " + newQuantity
        );
    }

    // GET CURRENT STOCK
    @Transactional(readOnly = true)
    public int getStock(Long id) {

        Product product = productDAO.getProductById(id);

        validator.validateProductExists(product, id.intValue());

        return product.getQuantity();
    }
}
