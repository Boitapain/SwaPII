import streamlit as st
from utils.i18n import Translator

def load():
    # Set up top navigation for files in 'pages' directory
    if "lang" not in st.session_state:
        st.session_state["lang"] = "fr"
    t = Translator(st.session_state["lang"])

    pg = st.navigation([
        st.Page("pages/home.py", title=t.t("home.title"), icon=":material/home:"),
        st.Page("pages/swap.py", title=t.t("swap.title"), icon=":material/swap_horiz:"),
        st.Page("pages/language.py", title=t.t("language.title"), icon=":material/language:"),
        st.Page("pages/profile.py", title=t.t("profile.title"), icon=":material/account_circle:"),
        st.Page("pages/test.py", title="Test", icon=":material/science:")
    ], position="top", expanded=True)
    pg.run()