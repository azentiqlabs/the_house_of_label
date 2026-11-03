"use client";

import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

type AccountProfile = { id: string; name: string; email: string; role: string };

export function AccountSettingsManager() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/admin/account", {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Could not load account details.");
        if (active) {
          const data = result.data as AccountProfile;
          setProfile(data);
          setName(data.name);
          setEmail(data.email);
          setConfirmEmail(data.email);
        }
      } catch (loadError) {
        if (active)
          setProfileError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load account details.",
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileNotice("");
    try {
      const response = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "profile",
          name,
          email,
          confirmEmail,
          currentPassword: profilePassword,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not update account details.");
      setProfile(result.data as AccountProfile);
      setName(result.data.name);
      setEmail(result.data.email);
      setConfirmEmail(result.data.email);
      setProfilePassword("");
      setProfileNotice("Your name and sign-in email have been updated.");
    } catch (saveError) {
      setProfileError(
        saveError instanceof Error
          ? saveError.message
          : "Could not update account details.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordNotice("");
    if (newPassword.length < 12) {
      setPasswordError("Use at least 12 characters for your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("The new passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const response = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "password",
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not change password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordNotice(result.message || "Your password has been updated.");
    } catch (saveError) {
      setPasswordError(
        saveError instanceof Error
          ? saveError.message
          : "Could not change password.",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="hol-friendly-page hol-account-manager">
      <div className="hol-friendly-heading">
        <div>
          <div className="hol-eyebrow">YOUR ADMIN ACCESS</div>
          <h1>Account settings</h1>
          <p>
            Update the name and email you use to sign in, or change your
            password. These settings affect your administrator account only.
          </p>
        </div>
      </div>

      <div className="hol-account-security-banner">
        <span>
          <ShieldCheck size={21} />
        </span>
        <div>
          <strong>Keep your account secure</strong>
          <p>
            Only you can change these details. We ask for your current password
            before saving any account changes.
          </p>
        </div>
        <span className="hol-account-role">
          {profile?.role?.replaceAll("_", " ") || "ADMIN"}
        </span>
      </div>
      {loading ? (
        <div className="hol-admin-card hol-sections-loading">
          <LoaderCircle size={22} className="hol-spin" /> Loading account
          details…
        </div>
      ) : (
        <div className="hol-account-grid">
          <section className="hol-admin-card hol-account-card">
            <header className="hol-account-card-header">
              <span>
                <UserRound size={19} />
              </span>
              <div>
                <h2>Personal details</h2>
                <p>
                  Change the display name and sign-in email for your admin
                  account.
                </p>
              </div>
            </header>
            {profileError && (
              <div className="hol-alert hol-alert-error" role="alert">
                <AlertCircle size={16} />
                {profileError}
              </div>
            )}
            {profileNotice && (
              <div className="hol-alert hol-alert-success" role="status">
                <Check size={16} />
                {profileNotice}
              </div>
            )}
            <form className="hol-account-form" onSubmit={saveProfile}>
              <div className="hol-account-field">
                <label htmlFor="admin-name">Your name</label>
                <input
                  id="admin-name"
                  className="hol-field"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
                <small>This name is shown in the admin dashboard.</small>
              </div>
              <div className="hol-account-field">
                <label htmlFor="admin-email">New sign-in email address</label>
                <div className="hol-account-input-icon">
                  <Mail size={17} />
                  <input
                    id="admin-email"
                    className="hol-field"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    required
                  />
                </div>
                <small>This becomes the email you use to sign in.</small>
              </div>
              <div className="hol-account-field">
                <label htmlFor="admin-confirm-email">
                  Confirm new email address
                </label>
                <input
                  id="admin-confirm-email"
                  className="hol-field"
                  type="email"
                  value={confirmEmail}
                  onChange={(event) => setConfirmEmail(event.target.value)}
                  maxLength={254}
                  autoComplete="email"
                  required
                />
                <small>
                  Re-enter the address to help avoid typing mistakes. This
                  project does not yet send a verification email.
                </small>
              </div>
              <div className="hol-account-field">
                <label htmlFor="profile-current-password">
                  Confirm with your current password
                </label>
                <input
                  id="profile-current-password"
                  className="hol-field"
                  type="password"
                  value={profilePassword}
                  onChange={(event) => setProfilePassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <small>
                  For security, enter your current password to change your
                  account details.
                </small>
              </div>
              <div className="hol-account-actions">
                <button
                  type="submit"
                  className="hol-button hol-button-primary"
                  disabled={savingProfile || !profilePassword}
                >
                  {savingProfile ? (
                    <>
                      <LoaderCircle size={16} className="hol-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Save account details
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className="hol-admin-card hol-account-card">
            <header className="hol-account-card-header">
              <span>
                <KeyRound size={19} />
              </span>
              <div>
                <h2>Change password</h2>
                <p>
                  Choose a strong password that you do not use on other
                  websites.
                </p>
              </div>
            </header>
            {passwordError && (
              <div className="hol-alert hol-alert-error" role="alert">
                <AlertCircle size={16} />
                {passwordError}
              </div>
            )}
            {passwordNotice && (
              <div className="hol-alert hol-alert-success" role="status">
                <Check size={16} />
                {passwordNotice}
              </div>
            )}
            <form className="hol-account-form" onSubmit={savePassword}>
              <div className="hol-account-field">
                <label htmlFor="account-current-password">
                  Current password
                </label>
                <div className="hol-account-password">
                  <input
                    id="account-current-password"
                    className="hol-field"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((value) => !value)}
                    aria-label={
                      showCurrent
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div className="hol-account-field">
                <label htmlFor="account-new-password">New password</label>
                <div className="hol-account-password">
                  <input
                    id="account-new-password"
                    className="hol-field"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((value) => !value)}
                    aria-label={
                      showNew ? "Hide new password" : "Show new password"
                    }
                  >
                    {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <small>
                  Use at least 12 characters. A unique phrase with several words
                  is easier to remember.
                </small>
              </div>
              <div className="hol-account-field">
                <label htmlFor="account-confirm-password">
                  Confirm new password
                </label>
                <div className="hol-account-password">
                  <input
                    id="account-confirm-password"
                    className="hol-field"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    aria-label={
                      showConfirm ? "Hide confirmation" : "Show confirmation"
                    }
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div className="hol-account-password-note">
                <ShieldCheck size={16} />
                <p>
                  After changing your password, other active admin sessions will
                  be signed out. This browser will remain signed in.
                </p>
              </div>
              <div className="hol-account-actions">
                <button
                  type="submit"
                  className="hol-button hol-button-primary"
                  disabled={
                    savingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                >
                  {savingPassword ? (
                    <>
                      <LoaderCircle size={16} className="hol-spin" /> Updating…
                    </>
                  ) : (
                    <>
                      <KeyRound size={16} /> Update password
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
