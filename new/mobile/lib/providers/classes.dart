import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../utils/api.dart';

class ClassesProvider extends ChangeNotifier {
  bool loading = false;
  List classes = [];

  Future<void> getClasses() async {
    loading = true;

    var response = await Server.get("/classes");

    if (response.statusCode == 200) {
      loading = false;

      classes = jsonDecode(response.body)["classes"];
      notifyListeners();
    }
  }

  Future<void> createClass(String name, String section, String subject) async {
    loading = true;
    notifyListeners();

    var response = await Server.post(
        "/classes/new", {"name": name, "section": section, "subject": subject});

    if (response.statusCode == 200) {
      loading = false;
      notifyListeners();

      Fluttertoast.showToast(msg: "Class created");
      getClasses();
    } else {
      Fluttertoast.showToast(msg: "Failed to create class");
    }
  }
}
