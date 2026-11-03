
package com.inventory.dao;

import com.inventory.database_system.entity.Transaction;
import com.inventory.database_system.repository.TransactionRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TransactionDAO {

    private final TransactionRepository transactionRepository;

    public TransactionDAO(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Save a new inventory transaction
    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Get all transactions, newest first
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get transactions by product ID
    public List<Transaction> getTransactionsByProduct(Long productId) {
        return transactionRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    // Get transactions by type
    public List<Transaction> getTransactionsByType(String type) {
        return transactionRepository.findByTypeOrderByCreatedAtDesc(type);
    }
}
