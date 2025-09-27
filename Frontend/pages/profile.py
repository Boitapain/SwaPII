import hashlib
import random
import requests
import streamlit as st
from utils.i18n import Translator
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = st.secrets["connections.supabase"]["SUPABASE_URL"]
SUPABASE_KEY = st.secrets["connections.supabase"]["SUPABASE_KEY"]
EDGE_FUNCTION_URL = st.secrets["connections.supabase"]["CREATE_USER_PROFILE_FN"]

def get_translator():
    lang = st.session_state.get("lang", "en")
    return Translator(lang)

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def show_profile(user):
    t = get_translator()
    email = user.get('email', '-')
    
    def get_color_from_email(email):
        random.seed(int(hashlib.md5(email.encode()).hexdigest(), 16))
        colors = ["#FF5733", "#FF8800", "#FFC300", "#33FF57", "#33FFF3", "#3375FF", "#C700FF"]
        return random.choice(colors)

    def avatar_html(email, size=50):
        initials = email[:2].upper() if email and email != '-' else "?"
        bg_color = get_color_from_email(email)
        html = f"""
        <div style="
            width: {size}px;
            height: {size}px;
            background-color: {bg_color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: {size//2}px;
            color: white;
            text-transform: uppercase;
            margin-right: 16px;
        ">
            {initials}
        </div>
        """
        return html

    col1, col2 = st.columns([1, 8])
    with col1:
        st.markdown(avatar_html(email, size=50), unsafe_allow_html=True)
    with col2:
        st.header(t.t("profile.header") if hasattr(t, 't') else "Profile")
    st.write(f"**{t.t('profile.email') if hasattr(t, 't') else 'Email'}:** {user.get('email', '-')}")
    st.write(f"**{t.t('profile.id') if hasattr(t, 't') else 'ID'}:** {user.get('id', '-')}")
    st.button(t.t("profile.logout") if hasattr(t, 't') else "Logout", on_click=logout)

def logout():
    for key in ["supabase_user", "supabase_token"]:
        if key in st.session_state:
            del st.session_state[key]
    st.rerun()

def call_create_user_profile(user_id):
    """Call Edge Function to create profile with role + IP"""
    try:
        res = requests.post(
            EDGE_FUNCTION_URL,
            json={"user_id": user_id},
            timeout=10
        )
        if res.status_code == 200:
            st.success("Profile created with default role and IP.")
        else:
            st.warning(f"Profile creation failed: {res.json().get('error')}")
    except Exception as e:
        st.error(f"Edge Function call failed: {e}")

def main():
    t = get_translator()
    st.title(t.t("profile.title") if hasattr(t, 't') else "Profile")
    sb = get_supabase_client()

    user = st.session_state.get("supabase_user")
    if user:
        show_profile(user)
        return

    st.info(t.t("profile.login_prompt") if hasattr(t, 't') else "Please log in to view your profile.")
    with st.form("login_form_profile_page"):
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        col1, col2 = st.columns(2)
        with col1:
            sign_in = st.form_submit_button("Sign In")
        with col2:
            sign_up = st.form_submit_button("Sign Up")

    if sign_in:
        try:
            auth_response = sb.auth.sign_in_with_password({"email": email, "password": password})
            if auth_response.user:
                user_id = auth_response.user.id
                # Call Edge Function to ensure profile exists
                call_create_user_profile(user_id)
                st.session_state["supabase_user"] = auth_response.user.__dict__
                st.session_state["supabase_token"] = auth_response.session.access_token if auth_response.session else None
                st.success(t.t("profile.login_success"))
                st.rerun()
            else:
                st.error(t.t("profile.login_failed"))
        except Exception as e:
            msg = str(e)
            if "You must provide either an email or phone number and a password" in msg:
                st.error(t.t("profile.missing_email_password"))
            elif "Email address" in msg and "is invalid" in msg:
                st.error(t.t("profile.invalid_email"))
            elif "Email not confirmed" in msg or "not verified" in msg:
                st.error(t.t("profile.account_not_verified"))
            elif "Invalid login credentials" in msg or "Invalid credentials" in msg:
                st.error(t.t("profile.login_failed"))
            else:
                st.error(msg)

    elif sign_up:
        try:
            signup_response = sb.auth.sign_up({"email": email, "password": password})
            user_obj = getattr(signup_response, 'user', None)
            user_id = getattr(user_obj, 'id', None) if user_obj else None
            if user_obj and user_id:
                st.success(t.t("profile.signup_success"))
            else:
                st.error(t.t("profile.signup_failed"))
        except Exception as e:
            msg = str(e)
            if "You must provide either an email or phone number and a password" in msg:
                st.error(t.t("profile.missing_email_password"))
            elif "Email address" in msg and "is invalid" in msg:
                st.error(t.t("profile.invalid_email"))
            elif "already registered" in msg or "already in use" in msg:
                st.error(t.t("profile.signup_failed"))
            elif "Password should be at least" in msg:
                st.error(t.t("profile.password_too_short"))
            else:
                st.error(msg)

if __name__ == "__main__":
    main()
