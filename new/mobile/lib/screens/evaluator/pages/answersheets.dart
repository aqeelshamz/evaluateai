import 'dart:io';

import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class AnswerSheetsPage extends StatefulWidget {
  const AnswerSheetsPage({super.key});

  @override
  State<AnswerSheetsPage> createState() => _AnswerSheetsPageState();
}

class _AnswerSheetsPageState extends State<AnswerSheetsPage> {
  @override
  Widget build(BuildContext context) {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView.builder(
        itemCount:
            evaluatorProvider.evaluatorData["classId"]["students"].length,
        itemBuilder: (BuildContext context, int index) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "${index + 1}. ${evaluatorProvider.evaluatorData["classId"]["students"][index]["name"]}",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Wrap(
                children: getAnswerSheets(index),
              ),
              evaluatorProvider.uploadingAnswerSheets
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

                              evaluatorProvider.addAnswerSheets(index,[file]);
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
                              List<XFile>? files =
                                  await picker.pickMultiImage();

                              List<File> fileList = [];
                              for (var i = 0; i < files.length; i++) {
                                fileList.add(File(files[i].path));
                              }

                              evaluatorProvider.addAnswerSheets(index, fileList);
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
              const SizedBox(height: 30),
            ],
          );
        },
      ),
    );
  }

  List<Widget> getAnswerSheets(int index) {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: false);

    List<Widget> widgets = [];

    for (var i = 0;
        i <
            evaluatorProvider
                .evaluatorData["answerSheets"][index]["answerSheets"].length;
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
                    evaluatorProvider.evaluatorData["answerSheets"][index]
                        ["answerSheets"][i],
                    fit: BoxFit.cover),
              ),
              Positioned(
                top: 0,
                right: 0,
                child: InkWell(
                  onTap: () {
                    evaluatorProvider.removeAnswerSheet(index, i);
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
