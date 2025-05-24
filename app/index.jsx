import React, { useEffect } from 'react';
import useFirebaseUser from "../hooks/useFirebaseUser";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, loading } = useFirebaseUser();

  if (loading) return null;

  return user ? <Redirect href={'/(tabs)/home'} /> : <Redirect href={'/email-login'} />;
}
