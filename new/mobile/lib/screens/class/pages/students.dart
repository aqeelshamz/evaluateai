import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/providers/user.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class StudentsPage extends StatefulWidget {
  const StudentsPage({super.key});

  @override
  State<StudentsPage> createState() => _StudentsPageState();
}

class _StudentsPageState extends State<StudentsPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var userProvider = Provider.of<UserProvider>(context, listen: true);
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [],
      ),
    );
  }
}
