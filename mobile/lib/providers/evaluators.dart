import 'dart:convert';
import 'dart:io';
import 'package:evaluateai/utils/api.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:uploadthing/uploadthing.dart';

class EvaluatorsProvider extends ChangeNotifier {
  List<dynamic> evaluators = [];
  Map evaluations = {};
  Map user = {};
  Map limits = {};
  Map allResults = {};
  int uploadingAnswerSheetStudentIndex = -1;

  Future<void> getEvaluators() async {
    var response = await Server.get("/evaluate/evaluators");
    if (response.statusCode == 200) {
      evaluators = jsonDecode(response.body)["evaluators"];
      user = jsonDecode(response.body)["user"];
      limits = jsonDecode(response.body)["limits"];
      notifyListeners();
    }
  }

  void getEvaluations(String evaluatorId) async {
    evaluations = {};
    notifyListeners();
    var response = await Server.post(
        "/evaluate/evaluations/get", {"evaluatorId": evaluatorId});
    print(response.body);

    if (response.statusCode == 200) {
      evaluations = jsonDecode(response.body);
      notifyListeners();
    }
  }

  void updateEvaluation(String evaluatorId, List answerSheets) async {
    await Server.post("/evaluate/evaluations/update",
        {"evaluatorId": evaluatorId, "answerSheets": answerSheets});
  }

  void uploadAnswerSheet(
      String evaluatorId, File file, int studentIndex) async {
    uploadingAnswerSheetStudentIndex = studentIndex;
    notifyListeners();

    UploadThing uploadThing = new UploadThing(uploadThingAPIKey);
    print("Uploading file...");
    await uploadThing.uploadFiles([file]);
    print(uploadThing.uploadedFiles);
    print(uploadThing.uploadedFilesData);

    Future.delayed(Duration(seconds: 2), () {
      String fileUrl = uploadThing.uploadedFilesData[0]["url"];

      evaluations["answerSheets"][studentIndex].add(fileUrl);

      updateEvaluation(evaluatorId, evaluations["answerSheets"]);

      uploadingAnswerSheetStudentIndex = -1;
      notifyListeners();
    });
  }

  void deleteAnswerSheet(String evaluatorId, int studentIndex, int fileIndex) {
    evaluations["answerSheets"][studentIndex].removeAt(fileIndex);
    updateEvaluation(evaluatorId, evaluations["answerSheets"]);
    notifyListeners();
  }

  int evaluatingRollNo = -1;

  Future<void> evaluate(String evaluatorId, int rollNo) async {
    evaluatingRollNo = rollNo;
    notifyListeners();

    var response = await Server.post("/evaluate/evaluators/evaluate",
        {"evaluatorId": evaluatorId, "rollNo": rollNo});

    evaluatingRollNo = -1;
    notifyListeners();
    getEvaluators();

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Evaluation completed for roll no. $rollNo"),
        backgroundColor: Colors.green,
      ));
    } else {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Evaluation failed for roll no. $rollNo"),
        backgroundColor: Colors.red,
      ));
    }
  }

  void getResultsAll(String evaluatorId) async {
    var response = await Server.post(
        "/evaluate/evaluations/results/all", {"evaluatorId": evaluatorId});
    print(response.body);

    if (response.statusCode == 200) {
      allResults = jsonDecode(response.body);
      notifyListeners();
    }
  }

  Map detailedResult = {};
  void getResultDetailed(String evaluatorId, int rollNo) async {
    var response = await Server.post("/evaluate/evaluations/results",
        {"evaluatorId": evaluatorId, "rollNo": rollNo});
    print(response.body);

    if (response.statusCode == 200) {
      detailedResult = jsonDecode(response.body);
      notifyListeners();
    } else {
      detailedResult = {};
      notifyListeners();
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Failed to get detailed result"),
        backgroundColor: Colors.red,
      ));
    }
  }

  Future<String> uploadImage(File file) async {
    UploadThing uploadThing = new UploadThing(uploadThingAPIKey);
    await uploadThing.uploadFiles([file]);

    return uploadThing.uploadedFilesData[0]["url"];
  }

  bool creatingEvaluator = false;
  Future<void> createEvaluator(String classId, String title,
      List<String> questionPapers, List<String> answerKeys) async {
    creatingEvaluator = true;
    notifyListeners();
    var response = await Server.post("/evaluate/evaluators/create", {
      "classId": classId,
      "title": title,
      "questionPapers": questionPapers,
      "answerKeys": answerKeys
    });

    creatingEvaluator = false;
    notifyListeners();

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Evaluator created successfully"),
        backgroundColor: Colors.green,
      ));
      getEvaluators();
      Get.back();
    } else {
      print(response.body);
      ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(
        content: Text("Failed to create evaluator"),
        backgroundColor: Colors.red,
      ));
    }
  }
}
