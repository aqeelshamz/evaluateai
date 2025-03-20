import 'dart:convert';
import 'package:evaluateai/screens/home.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:get/get.dart';

import '../utils/api.dart';

class ClassesProvider extends ChangeNotifier {
  bool loading = false;
  List classes = [];
  Map classData = {};
  String selectedClassId = "";

  Future<void> getClasses() async {
    loading = true;

    var response = await Server.get("/classes");

    if (response.statusCode == 200) {
      loading = false;

      classes = jsonDecode(response.body)["classes"];
      notifyListeners();
    }
  }

  Future<void> getClass() async {
    loading = true;

    var response = await Server.post("/classes/by-id", {
      "classId": selectedClassId,
    });

    if (response.statusCode == 200) {
      loading = false;

      classData = jsonDecode(response.body);
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

  Future<void> updateClass(String name, String section, String subject) async {
    loading = true;
    notifyListeners();

    var response = await Server.post("/classes/save", {
      "classId": selectedClassId,
      "name": name,
      "section": section,
      "subject": subject,
    });

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Class saved");
      getClasses();
    } else {
      Fluttertoast.showToast(msg: "Failed to save class");
    }
  }

  Future<void> deleteClass() async {
    loading = true;
    notifyListeners();

    var response = await Server.post("/classes/delete", {
      "classId": selectedClassId,
    });

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Class deleted");
      getClasses();
      Get.offAll(() => HomeScreen());
    } else {
      Fluttertoast.showToast(msg: "Failed to delete class");
    }
  }

  void addStudent(String name, String email, int rollNo) async {
    loading = true;
    notifyListeners();

    var response = await Server.post("/classes/add-student", {
      "classId": selectedClassId,
      "email": email,
      "name": name,
      "rollNo": rollNo,
    });

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Student added");
      getClass();
      getClasses();
      Get.back();
    } else {
      Fluttertoast.showToast(msg: "Failed to add student");
      Get.back();
    }
  }

  void deleteStudent(int rollNo) async {
    loading = true;
    notifyListeners();

    var response = await Server.post("/classes/delete-student", {
      "classId": selectedClassId,
      "rollNo": rollNo,
    });

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Student deleted");
      getClass();
      getClasses();
      Get.back();
    } else {
      Fluttertoast.showToast(msg: "Failed to delete student");
      Get.back();
    }
  }

  void selectClass(String classId) {
    selectedClassId = classId;
    notifyListeners();
  }
}
