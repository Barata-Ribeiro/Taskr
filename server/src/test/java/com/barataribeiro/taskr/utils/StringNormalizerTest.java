package com.barataribeiro.taskr.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StringNormalizerTest {
    @Test
    @DisplayName("It should return capitalized word for single word status")
    void itShouldReturnCapitalizedWordForSingleWordStatus() {
        assertEquals("Active", StringNormalizer.formatStatus("ACTIVE"));
    }

    @Test
    @DisplayName("It should return space separated and capitalized words for multiple word status")
    void itShouldReturnSpaceSeparatedAndCapitalizedWordsForMultipleWordStatus() {
        assertEquals("In Progress", StringNormalizer.formatStatus("IN_PROGRESS"));
    }

    @Test
    @DisplayName("It should properly format mixed case input for status")
    void itShouldProperlyFormatMixedCaseInputForStatus() {
        assertEquals("On Hold", StringNormalizer.formatStatus("oN_HoLD"));
    }

    @Test
    @DisplayName("It should return empty string for empty status input")
    void itShouldReturnEmptyStringForEmptyStatusInput() {
        assertEquals("", StringNormalizer.formatStatus(""));
    }

    @Test
    @DisplayName("It should replace whitespace with hyphens and lowercase for slug")
    void itShouldReplaceWhitespaceWithHyphensAndLowercaseForSlug() {
        assertEquals("hello-world", StringNormalizer.toSlug("Hello World"));
    }

    @Test
    @DisplayName("It should remove non-latin characters for slug")
    void itShouldRemoveNonLatinCharactersForSlug() {
        assertEquals("cafe", StringNormalizer.toSlug("Café"));
    }

    @Test
    @DisplayName("It should handle multiple spaces and special characters for slug")
    void itShouldHandleMultipleSpacesAndSpecialCharactersForSlug() {
        assertEquals("foo-bar-baz", StringNormalizer.toSlug("Foo   Bar!@# Baz"));
    }

    @Test
    @DisplayName("It should return empty string for empty slug input")
    void itShouldReturnEmptyStringForEmptySlugInput() {
        assertEquals("", StringNormalizer.toSlug(""));
    }

    @Test
    @DisplayName("It should return empty string for slug with only special characters")
    void itShouldReturnEmptyStringForSlugWithOnlySpecialCharacters() {
        assertEquals("", StringNormalizer.toSlug("!@#$%^&*()"));
    }

    @Test
    @DisplayName("It should not change already formatted slug")
    void itShouldNotChangeAlreadyFormattedSlug() {
        assertEquals("already-formatted-slug", StringNormalizer.toSlug("already-formatted-slug"));
    }

    @Test
    @DisplayName("It should handle contractions in slug")
    void itShouldHandleContractionsInSlug() {
        assertEquals("mammas", StringNormalizer.toSlug("Mamma's"));
        assertEquals("sisters", StringNormalizer.toSlug("Sister's"));
        assertEquals("dont-stop-believing", StringNormalizer.toSlug("Don't Stop Believing"));
        assertEquals("nows-your-chance", StringNormalizer.toSlug("Now’s your chance."));
        assertEquals("the-companies-logos", StringNormalizer.toSlug("the companies' logos"));
    }
}