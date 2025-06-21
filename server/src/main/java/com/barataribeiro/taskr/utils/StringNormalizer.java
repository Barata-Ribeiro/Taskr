package com.barataribeiro.taskr.utils;

import org.jetbrains.annotations.NotNull;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;


public class StringNormalizer {
    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("\\s");

    private StringNormalizer() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }

    public static @NotNull String formatStatus(@NotNull String status) {
        if (status.isEmpty()) return "";
        String[] words = status.split("_");
        StringBuilder formatted = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            if (words[i].isEmpty()) continue;
            if (i > 0) formatted.append(" ");
            formatted.append(words[i].substring(0, 1).toUpperCase())
                     .append(words[i].substring(1).toLowerCase());
        }
        return formatted.toString();
    }

    public static @NotNull String toSlug(String input) {
        String noWhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        slug = slug.replaceAll("-{2,}", "-"); // Replace multiple dashes with a single dash
        slug = slug.replaceAll("(^-)|(-$)", ""); // Remove leading and trailing dashes
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
