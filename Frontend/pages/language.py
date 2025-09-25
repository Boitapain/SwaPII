import streamlit as st
from utils.i18n import Translator

t = None
if "lang" not in st.session_state:
    st.session_state["lang"] = "en"
t = Translator(st.session_state["lang"])

t = Translator(st.session_state["lang"])

langs = [
    (t.t("language.french"), "fr"),
    (t.t("language.spanish"), "es"),
    (t.t("language.english"), "en"),
    (t.t("language.german"), "de")
]

with st.container(key="language_selection", horizontal_alignment="center", vertical_alignment="center"):
    st.title(t.t("language.title"))
    col1, col2 = st.columns(2, gap="large")
    def set_lang(lang_code):
        st.session_state["lang"] = lang_code
        st.session_state["should_rerun"] = True
    with col1:
        st.button(langs[0][0], key="lang-btn-fr", icon="🇫🇷", on_click=set_lang, args=(langs[0][1],), use_container_width=True)
        st.button(langs[2][0], key="lang-btn-en", icon="🇬🇧", on_click=set_lang, args=(langs[2][1],), use_container_width=True)
    with col2:
        st.button(langs[1][0], key="lang-btn-es", icon="🇪🇸", on_click=set_lang, args=(langs[1][1],), use_container_width=True)
        st.button(langs[3][0], key="lang-btn-de", icon="🇩🇪", on_click=set_lang, args=(langs[3][1],), use_container_width=True)

# Rerun logic outside callback
if st.session_state.get("should_rerun"):
    st.session_state["should_rerun"] = False
    st.rerun()