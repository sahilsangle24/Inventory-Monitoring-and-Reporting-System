
package com.inventory.database_system.repository;

import com.inventory.database_system.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    // Get all transactions, newest first
    List<Transaction> findAllByOrderByCreatedAtDesc();

    // Get transactions for a specific product
    List<Transaction> findByProductIdOrderByCreatedAtDesc(Long productId);

    // Filter transactions by type: INCREASE or REDUCE
    List<Transaction> findByTypeOrderByCreatedAtDesc(String type);
}
