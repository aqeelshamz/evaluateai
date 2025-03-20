import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/screens/class/pages/details.dart';
import 'package:evaluateai/screens/class/pages/students.dart';
import 'package:evaluateai/screens/evaluator/pages/answersheets.dart';
import 'package:evaluateai/screens/evaluator/pages/details.dart';
import 'package:evaluateai/screens/evaluator/pages/evaluate.dart';
import 'package:evaluateai/screens/evaluator/pages/materials.dart';
import 'package:evaluateai/screens/evaluator/pages/results.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:provider/provider.dart';

class ClassScreen extends StatefulWidget {
  const ClassScreen({super.key});

  @override
  State<ClassScreen> createState() => _ClassScreenState();
}

class _ClassScreenState extends State<ClassScreen> {
  int currentPageIndex = 0;
  PageController pageController = PageController();

  @override
  Widget build(BuildContext context) {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    return Scaffold(
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPageIndex = index;
          });
          pageController.jumpToPage(index);
        },
        selectedIndex: currentPageIndex,
        destinations: <Widget>[
          NavigationDestination(
            icon: Icon(FeatherIcons.info),
            label: 'Details',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.users),
            label: 'Students',
          ),
        ],
      ),
      body: SafeArea(
        child: PageView(
          controller: pageController,
          children: const <Widget>[
            ClassDetailsPage(),
            StudentsPage(),
          ],
          onPageChanged: (int index) {
            setState(() {
              currentPageIndex = index;
            });
          },
        ),
      ),
    );
  }
}
