import 'dart:convert';

import 'package:evaluateai/utils/api.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ClassesProvider extends ChangeNotifier {
  List<dynamic> classes = [];
  List<dynamic> students = [];

  Future<void> getClasses() async {
    var response = await Server.get("/class");
    print(response.body);

    if (response.statusCode == 200) {
      classes = jsonDecode(response.body);
      notifyListeners();
    }
  }

  Future<void> getStudents(String classId) async {
    var response = await Server.post("/class/students", {"classId": classId});
    print(response.body);

    if (response.statusCode == 200) {
      students = jsonDecode(response.body);
      notifyListeners();
    }
  }

  bool creatingClass = false;
  Future<void> createClass(
      String className, String section, String subject) async {
    creatingClass = true;
    notifyListeners();
    var response = await Server.post("/class/create", {
      "name": className,
      "section": section,
      "subject": subject,
    });

    creatingClass = false;
    notifyListeners();

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Class created successfully"),
        backgroundColor: Colors.green,
      ));
      getClasses();
      Get.back();
    } else {
      print(response.body);
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Failed to create class"),
        backgroundColor: Colors.red,
      ));
    }
  }

  Future<void> deleteClass(String classId) async {
    var response = await Server.post("/class/delete", {"classId": classId});

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Class deleted successfully"),
        backgroundColor: Colors.green,
      ));
      getClasses();
      Get.back();
    } else {
      print(response.body);
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Failed to delete class"),
        backgroundColor: Colors.red,
      ));
    }
  }

  Future<void> addStudent(String classId, String name, int rollNo) async {
    var response = await Server.post("/class/add-student", {
      "classId": classId,
      "name": name,
      "rollNo": rollNo,
    });

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Student added successfully"),
        backgroundColor: Colors.green,
      ));
      getStudents(classId);
    } else {
      print(response.body);
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Failed to add student"),
        backgroundColor: Colors.red,
      ));
    }
  }

  Future<void> deleteStudent(String classId, int rollNo) async {
    var response = await Server.post("/class/students/delete", {
      "classId": classId,
      "rollNo": rollNo,
    });

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Student deleted successfully"),
        backgroundColor: Colors.green,
      ));
      getStudents(classId);
    } else {
      print(response.body);
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Failed to delete student"),
        backgroundColor: Colors.red,
      ));
    }
  }
}
