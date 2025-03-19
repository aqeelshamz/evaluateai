import 'dart:convert';

import 'package:evaluateai/screens/home.dart';
import 'package:evaluateai/screens/login.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/api.dart';

class UserProvider extends ChangeNotifier {
  bool loading = false;
  Map profile = {};
  Map limits = {};

  void checkAuth() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    if (prefs.getString('token') == null) {
      Get.offAll(() => LoginScreen());
    } else {
      await getProfile();
      Get.offAll(() => HomeScreen());
    }
  }

  void login(String email, String password) async {
    loading = true;
    notifyListeners();
    if (email.isEmpty || password.isEmpty) {
      Fluttertoast.showToast(msg: "Please fill all fields");
      return;
    }

    var response = await Server.post(
        "/users/login", {"email": email, "password": password});

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      await getProfile();
      Fluttertoast.showToast(msg: "Logged in");
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString("token", jsonDecode(response.body)["token"]);
      Get.offAll(() => HomeScreen());
    } else {
      Fluttertoast.showToast(msg: "Invalid credentials");
    }
  }

  void logOut() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.clear();
    Get.offAll(() => LoginScreen());
  }

  Future<void> getProfile() async {
    loading = true;

    var response = await Server.get("/users");

    if (response.statusCode == 200) {
      loading = false;

      profile = jsonDecode(response.body);

      getLimits();
      notifyListeners();
    }
  }

  Future<void> getLimits() async {
    loading = true;
    notifyListeners();

    var response = await Server.get("/users/limits");

    if (response.statusCode == 200) {
      loading = false;

      limits = jsonDecode(response.body);
      notifyListeners();
    }
  }
}
