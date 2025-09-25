# utils/i18n.py
# Simple i18n utility for Streamlit using a dictionary approach


import json
import os

class Translator:
    TRANSLATION_FILES = {
        "en": "en.json",
        "fr": "fr.json",
        "es": "es.json",
        "de": "de.json",
    }

    def __init__(self, lang="en"):
        self.lang = lang if lang in self.TRANSLATION_FILES else "en"
        self.translations = self._load_translations(self.lang)

    def _load_translations(self, lang):
        filename = self.TRANSLATION_FILES[lang]
        path = os.path.join(os.path.dirname(__file__), filename)
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def t(self, key):
        parts = key.split('.')
        value = self.translations
        for part in parts:
            if isinstance(value, dict) and part in value:
                value = value[part]
            else:
                return key
        return value
