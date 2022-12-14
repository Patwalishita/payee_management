import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../shared/employee.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DepartmentService } from '../../shared/department.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
  
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from '../../shared/notification.service';
import { DialogService } from '../../shared/dialog.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(private service: EmployeeService, private deparmentService: DepartmentService, 
    private dialog: MatDialog, 
    private notificationService: NotificationService,
    private dialogService: DialogService) { }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['payeeName', 'ein', 'payeeCategory', 'payeeSpeciality','astatus','pStatus', 'actions'];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  seacrhKey: string;

  ngOnInit() {

    this.service.getEmployees().subscribe(
      list => {
        let array = list.map(item =>{
          let departmentName = this.deparmentService.getDepartmentName(item.payload.val()['department']); 
          return {
            $key: item.key,
            departmentName,
            ...item.payload.val()
          };
        });
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.filterPredicate = (data, filter) => {

          return this.displayedColumns.some(ele => {

            return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
          });
        };
    });
  }

  onSearchClear() {

    this.seacrhKey="";
    this.applyFilter();
  }

  applyFilter() {

    this.listData.filter = this.seacrhKey.trim().toLowerCase();
  }

  onCreate() {

    this.service.initializeFormGroup();   
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent, dialogConfig);
  }

  onEdit(row) {

    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent, dialogConfig);
  }

  onDelete($key) {

    // if(confirm('Are sure to delete this recod?')){
    //   this.service.deleteEmployee($key);
    //   this.notificationService.warn('Successfully deleted!');
    // }

    this.dialogService.openConfirmDialog('Are sure to delete this recod?')
    .afterClosed().subscribe(res => {
      if(res){
        this.service.deleteEmployee($key);
        this.notificationService.warn('Successfully deleted!');
      }
    });
  }
}
