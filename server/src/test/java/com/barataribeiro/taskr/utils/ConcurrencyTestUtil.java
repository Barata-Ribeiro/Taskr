package com.barataribeiro.taskr.utils;

import org.springframework.dao.DataIntegrityViolationException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public final class ConcurrencyTestUtil {
    public static void doAsyncAndConcurrently(int times, ThrowingRunnable runnable) {
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (int i = 0; i < times; i++) {
            futures.add(CompletableFuture.runAsync(() -> {
                try {
                    runnable.run();
                } catch (Exception e) {
                    if (!(e.getCause() instanceof DataIntegrityViolationException)) {
                        throw new RuntimeException(e);
                    }
                }
            }));
        }

        futures.parallelStream().forEach(CompletableFuture::join);
    }

    @FunctionalInterface
    public interface ThrowingRunnable {
        void run() throws Exception;
    }
}
