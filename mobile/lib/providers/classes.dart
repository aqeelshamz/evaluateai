import 'dart:convert';

import 'package:evaluateai/utils/api.dart';
import 'package:flutter/material.dart';

class ClassesProvider extends ChangeNotifier {
  List<dynamic> classes = [];
  List<dynamic> students = [];

  void getClasses() async {
    var response = await Server.get("/class");
    print(response.body);

    if (response.statusCode == 200) {
      classes = jsonDecode(response.body);
      notifyListeners();
    }
  }

  void getStudents(String classId) async {
    var response = await Server.post("/class/students", {"classId": classId});
    print(response.body);

    if (response.statusCode == 200) {
      students = jsonDecode(response.body);
      notifyListeners();
    }
  }
}
