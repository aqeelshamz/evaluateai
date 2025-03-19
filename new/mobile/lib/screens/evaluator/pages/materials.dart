import 'dart:io';

import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class MaterialsPage extends StatefulWidget {
  const MaterialsPage({super.key});

  @override
  State<MaterialsPage> createState() => _MaterialsPageState();
}

class _MaterialsPageState extends State<MaterialsPage> {
  @override
  Widget build(BuildContext context) {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: false);
    var evaluatorProviderListen =
        Provider.of<EvaluatorProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Row(
            children: [
              Icon(FeatherIcons.fileText),
              const SizedBox(width: 10),
              Text(
                "Question Paper",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            "Upload question paper for the evaluator. You can upload multiple files.",
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            children: getQuestionPapers(),
          ),
          evaluatorProviderListen.uploadingQuestionPapers
              ? Center(
                  child: CircularProgressIndicator(),
                )
              : Row(
                  children: [
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () async {
                          final ImagePicker picker = ImagePicker();
                          XFile? files = await picker.pickImage(
                              source: ImageSource.camera);

                          File file = File(files!.path);

                          evaluatorProvider.addQuestionPapers([file]);
                        },
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 15),
                          backgroundColor: primaryColor,
                          foregroundColor: Colors.white,
                        ),
                        icon: Icon(FeatherIcons.camera),
                        label: Text("Camera"),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () async {
                          final ImagePicker picker = ImagePicker();
                          List<XFile>? files = await picker.pickMultiImage();

                          List<File> fileList = [];
                          for (var i = 0; i < files.length; i++) {
                            fileList.add(File(files[i].path));
                          }

                          evaluatorProvider.addQuestionPapers(fileList);
                        },
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 15),
                          backgroundColor: primaryColor,
                          foregroundColor: Colors.white,
                        ),
                        icon: Icon(FeatherIcons.file),
                        label: Text("Choose File"),
                      ),
                    ),
                  ],
                ),
          const SizedBox(height: 40),
          Row(
            children: [
              Icon(FeatherIcons.fileText),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  "Answer Keys / Answering Criteria",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            "Upload answer keys / answering criteria for the evaluator. You can upload multiple files.",
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            children: getAnswerKeys(),
          ),
          evaluatorProviderListen.uploadingAnswerKeys
              ? Center(
                  child: CircularProgressIndicator(),
                )
              : Row(
                  children: [
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () async {
                          final ImagePicker picker = ImagePicker();
                          XFile? files = await picker.pickImage(
                              source: ImageSource.camera);

                          File file = File(files!.path);

                          evaluatorProvider.addAnswerKeys([file]);
                        },
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 15),
                          backgroundColor: primaryColor,
                          foregroundColor: Colors.white,
                        ),
                        icon: Icon(FeatherIcons.camera),
                        label: Text("Camera"),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () async {
                          final ImagePicker picker = ImagePicker();
                          List<XFile>? files = await picker.pickMultiImage();

                          List<File> fileList = [];
                          for (var i = 0; i < files.length; i++) {
                            fileList.add(File(files[i].path));
                          }

                          evaluatorProvider.addAnswerKeys(fileList);
                        },
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 15),
                          backgroundColor: primaryColor,
                          foregroundColor: Colors.white,
                        ),
                        icon: Icon(FeatherIcons.file),
                        label: Text("Choose File"),
                      ),
                    ),
                  ],
                ),
        ],
      ),
    );
  }

  List<Widget> getQuestionPapers() {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    List<Widget> widgets = [];

    for (var i = 0;
        i < evaluatorProvider.evaluatorData["questionPapers"].length;
        i++) {
      widgets.add(
        Container(
          margin: const EdgeInsets.only(right: 10, bottom: 10),
          width: 150,
          height: 150,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
          ),
          child: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(
                    evaluatorProvider.evaluatorData["questionPapers"][i],
                    fit: BoxFit.cover),
              ),
              Positioned(
                top: 0,
                right: 0,
                child: InkWell(
                  onTap: () {
                    evaluatorProvider.removeQuestionPaper(i);
                  },
                  child: Container(
                    padding: const EdgeInsets.all(5),
                    decoration: BoxDecoration(
                      color: Colors.black.withAlpha(150),
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(10),
                      ),
                    ),
                    child: Icon(
                      FeatherIcons.x,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return widgets;
  }

  List<Widget> getAnswerKeys() {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    List<Widget> widgets = [];

    for (var i = 0;
        i < evaluatorProvider.evaluatorData["answerKeys"].length;
        i++) {
      widgets.add(
        Container(
          margin: const EdgeInsets.only(right: 10, bottom: 10),
          width: 150,
          height: 150,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
          ),
          child: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(
                    evaluatorProvider.evaluatorData["answerKeys"][i],
                    fit: BoxFit.cover),
              ),
              Positioned(
                top: 0,
                right: 0,
                child: InkWell(
                  onTap: () {
                    evaluatorProvider.removeAnswerKey(i);
                  },
                  child: Container(
                    padding: const EdgeInsets.all(5),
                    decoration: BoxDecoration(
                      color: Colors.black.withAlpha(150),
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(10),
                      ),
                    ),
                    child: Icon(
                      FeatherIcons.x,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return widgets;
  }
}
