import 'package:evaluateai/screens/home.dart';
import 'package:evaluateai/screens/login.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../utils/api.dart';

class UserProvider extends ChangeNotifier {
  void checkAuth() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    if (prefs.getString('token') == null) {
      Get.offAll(() => LoginScreen());
    } else {
      Get.offAll(() => HomeScreen());
    }
  }

  void login() async {
    var response =
        await Server.post("/evaluate/evaluations/get", {"evaluatorId": ""});
    print(response.body);
  }
}
