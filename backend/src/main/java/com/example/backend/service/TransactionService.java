package com.example.backend.service;

import com.example.backend.entity.Transaction;
import com.example.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        Optional<Transaction> transactionOptional = transactionRepository.findById(id);
        if (transactionOptional.isEmpty()) {
            throw new RuntimeException("Transaction không tồn tại!");
        }
        Transaction transaction = transactionOptional.get();
        transaction.setUserId(updatedTransaction.getUserId());
        transaction.setAmount(updatedTransaction.getAmount());
        transaction.setTransactionDate(updatedTransaction.getTransactionDate());
        transaction.setStatus(updatedTransaction.getStatus());
        transaction.setDescription(updatedTransaction.getDescription());
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction không tồn tại!");
        }
        transactionRepository.deleteById(id);
    }

    public long countTransactions() {
        return transactionRepository.count();
    }
}