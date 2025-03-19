import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class EvaluatePage extends StatefulWidget {
  const EvaluatePage({super.key});

  @override
  State<EvaluatePage> createState() => _EvaluatePageState();
}

class _EvaluatePageState extends State<EvaluatePage> {
  TextEditingController promptController = TextEditingController();
  TextEditingController totalMarksController = TextEditingController();
  String prompt = "";
  int totalMarks = 100;

  @override
  void initState() {
    getData();
    super.initState();
  }

  void getData() async {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(Get.context!, listen: false);
    await evaluatorProvider.getEvaluator();
    promptController.text = evaluatorProvider.evaluatorData["extraPrompt"];
    totalMarksController.text =
        evaluatorProvider.evaluatorData["totalMarks"].toString();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Text("Extra prompt (optional)"),
          const SizedBox(height: 10),
          TextField(
            controller: promptController,
            onChanged: (value) {
              prompt = value;
            },
            decoration: InputDecoration(
              hintText: "Prompt",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            maxLines: 4,
          ),
          const SizedBox(height: 20),
          Text("Total Marks"),
          const SizedBox(height: 10),
          TextField(
            controller: totalMarksController,
            onChanged: (value) {
              totalMarks = int.parse(value == "" ? "100" : value);
            },
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: "Total Marks",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 20),
          TextButton.icon(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
            ),
            icon: Icon(FeatherIcons.play),
            label: Text("Evaluate"),
          ),
          const SizedBox(height: 10),
          Center(child: Text("0 evaluations left.")),
        ],
      ),
    );
  }
}
